"""
Tests for `backend.fields.BulkPrimaryKeyRelatedField`.

Two properties need pinning, and only one of them is the point of the field:

- resolving a `many=True` list costs one query, however long the list is;
- everything the preload cannot batch still lands on DRF's own per-item path, so the
  error a bad request gets back is exactly the error DRF would have produced.

The second is the easier half to lose, because losing it is free: delete the guards in
`preload` and every query-count test here still passes, while `{"teams": ["abc"]}` turns
from a 400 into an uncaught `ValueError`. `test_matches_plain_drf_exactly` is what
notices.
"""

from collections.abc import Callable
from typing import Any

import pytest
from django.db import connection
from django.test.utils import CaptureQueriesContext
from django.utils import timezone
from rest_framework import relations, serializers

from backend.fields import BulkManyRelatedField, BulkPrimaryKeyRelatedField
from events.models import Event, Team
from profiles.serializers import ProfileWriteSerializer


@pytest.fixture
def teams(db: None) -> list[Team]:
    now = timezone.now()
    event = Event.objects.create(name="Test Event", starts=now, ends=now)
    # Explicit pks, because a rolled-back test still leaves the sequence where it was and
    # the parity cases need to know what a real pk looks like: `True` only collides with a
    # row if pk 1 exists. Zero-padded names so `Team.Meta.ordering` matches creation order,
    # which lets the tests below compare against a plain slice
    return [Team.objects.create(pk=i, name=f"Team {i:02}", event=event) for i in range(1, 21)]


def build(
    field: Any = BulkPrimaryKeyRelatedField, **kwargs: Any
) -> type[serializers.Serializer]:
    """A one-field serializer, so these tests measure the field and nothing else."""

    class Serializer(serializers.Serializer):
        teams = field(queryset=Team.objects.all(), many=True, **kwargs)

    return Serializer


def outcome(field: Any, data: Any) -> Any:
    """What `field` makes of `data`: the objects it resolved, or the errors it raised."""
    serializer = build(field)(data={"teams": data})
    if serializer.is_valid():
        return list(serializer.validated_data["teams"])
    # `ErrorDetail.__eq__` compares the code as well as the message, so comparing two of
    # these compares everything `drf-standardized-errors` will go on to render
    return serializer.errors


@pytest.mark.parametrize("length", [1, 2, 5, 20])
def test_resolving_the_list_costs_one_query_whatever_its_length(
    teams: list[Team], length: int
) -> None:
    serializer = build()(data={"teams": [str(team.pk) for team in teams[:length]]})

    with CaptureQueriesContext(connection) as queries:
        assert serializer.is_valid(), serializer.errors

    assert len(queries) == 1
    assert list(serializer.validated_data["teams"]) == teams[:length]


def test_the_result_follows_the_request_rather_than_the_database(teams: list[Team]) -> None:
    """
    A batched `pk__in` comes back in the database's order, so answering from it could
    quietly reorder the list. It doesn't: DRF still walks the request item by item.
    """
    serializer = build()(data={"teams": [str(team.pk) for team in reversed(teams)]})

    assert serializer.is_valid(), serializer.errors
    assert list(serializer.validated_data["teams"]) == list(reversed(teams))


@pytest.mark.parametrize(
    "payload",
    [
        pytest.param(lambda teams: [team.pk for team in teams[:3]], id="ints"),
        pytest.param(lambda teams: [str(team.pk) for team in teams[:3]], id="strings"),
        pytest.param(lambda teams: [], id="empty"),
        pytest.param(lambda teams: [teams[0].pk, teams[0].pk], id="duplicate-pks"),
        pytest.param(lambda teams: [teams[0].pk, 10**9], id="missing-row"),
        pytest.param(lambda teams: [teams[0].pk, "abc"], id="not-a-pk"),
        pytest.param(lambda teams: [f"0{teams[0].pk}"], id="leading-zero"),
        pytest.param(lambda teams: [float(teams[0].pk)], id="float-pk"),
        pytest.param(lambda teams: [10**20], id="oversized-pk"),
        pytest.param(lambda teams: [True], id="bool"),
        pytest.param(lambda teams: [None], id="none"),
        pytest.param(lambda teams: [""], id="blank"),
        pytest.param(lambda teams: [{"pk": 1}], id="dict-item"),
        pytest.param(lambda teams: [[teams[0].pk]], id="nested-list"),
        pytest.param(lambda teams: teams[0].pk, id="not-a-list"),
        pytest.param(lambda teams: "12", id="string-body"),
    ],
)
def test_matches_plain_drf_exactly(
    teams: list[Team], payload: Callable[[list[Team]], Any]
) -> None:
    """
    The whole design rests on unbatchable input being indistinguishable from stock DRF,
    so compare the two fields directly rather than restating DRF's messages here.
    """
    data = payload(teams)

    assert outcome(BulkPrimaryKeyRelatedField, data) == outcome(
        relations.PrimaryKeyRelatedField, data
    )


class ShiftedPk(serializers.IntegerField):
    """Stands in for the obfuscated ids `pk_field` exists for: the wire value decodes."""

    OFFSET = 1000

    def to_internal_value(self, data: Any) -> int:
        return int(super().to_internal_value(data)) - self.OFFSET


def test_a_pk_field_falls_back_to_the_per_item_path(db: None) -> None:
    """
    `pk_field` decodes each value before it is used as a pk, so batching the raw list
    would look up the wrong rows - and silently find some, whenever an encoded id happens
    to also be a real pk. Both teams here exist precisely so that it would.
    """
    now = timezone.now()
    event = Event.objects.create(name="Test Event", starts=now, ends=now)
    wanted = Team.objects.create(pk=7, name="Wanted", event=event)
    Team.objects.create(pk=7 + ShiftedPk.OFFSET, name="Decoy", event=event)

    serializer = build(pk_field=ShiftedPk())(data={"teams": [str(7 + ShiftedPk.OFFSET)]})

    assert serializer.is_valid(), serializer.errors
    assert list(serializer.validated_data["teams"]) == [wanted]


def test_the_preload_does_not_outlive_the_call_that_filled_it(teams: list[Team]) -> None:
    """
    It is scratch space for one write, not state a field carries around afterwards. The
    first pk fills the map and the second one fails, so the map is non-empty at the
    moment the error unwinds - which is the only way to tell a reset from a no-op.
    """
    serializer = build()(data={"teams": [teams[0].pk, 10**9]})

    assert not serializer.is_valid()
    field = serializer.fields["teams"]
    assert isinstance(field, BulkManyRelatedField)
    assert field.preloaded == {}


def test_writing_a_profile_goes_through_it() -> None:
    """The reason any of this exists: `Profile.teams` is the list that gets written."""
    assert isinstance(ProfileWriteSerializer().fields["teams"], BulkManyRelatedField)
