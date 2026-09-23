"""
Tests that the write endpoints accept what the generated client actually sends.

Neither model here has a file field, so `order_request_content_types` leaves JSON first
and the client posts a plain JSON body. Multipart is still accepted, and is covered here
too because the ordering hook is the only thing keeping these endpoints off it.
"""

import pytest
from django.contrib.auth.models import User
from django.utils import timezone
from inline_snapshot import snapshot
from inline_snapshot_django import snapshot_queries
from rest_framework import status
from rest_framework.test import APIClient

from profiles.models import Profile

from .models import Event, Team


@pytest.fixture
def staff_client(db: None) -> APIClient:
    api = APIClient()
    api.force_authenticate(
        user=User.objects.create_user(username="staffer", password="pw", is_staff=True)
    )
    return api


def test_event_is_created_from_a_json_body(staff_client: APIClient) -> None:
    response = staff_client.post(
        "/api/events/",
        {
            "name": "JSON Event",
            "starts": "2026-01-01T00:00:00Z",
            "ends": "2026-02-01T00:00:00Z",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_201_CREATED
    event = Event.objects.get(name="JSON Event")
    assert event.starts.year == 2026
    assert event.starts < event.ends


def test_team_is_created_from_a_json_body(staff_client: APIClient) -> None:
    now = timezone.now()
    event = Event.objects.create(name="Host Event", starts=now, ends=now)

    response = staff_client.post(
        "/api/teams/", {"name": "Red", "event": event.pk}, format="json"
    )

    assert response.status_code == status.HTTP_201_CREATED
    assert Team.objects.get(name="Red").event == event


def test_team_reads_include_nested_event(staff_client: APIClient) -> None:
    """Read case test of our (slightly) custom get_serializer_class deal."""
    now = timezone.now()
    event = Event.objects.create(name="Host Event", starts=now, ends=now)
    team = Team.objects.create(name="Red", event=event)

    response = staff_client.get(f"/api/teams/{team.pk}/")
    assert response.status_code == status.HTTP_200_OK
    assert response.data["event"]["name"] == event.name


def test_multipart_is_still_accepted(staff_client: APIClient) -> None:
    """
    Parser order only decides what the *schema* advertises first, not which parser handles
    a given request - the media types are disjoint, so every registered parser stays
    reachable.
    """
    response = staff_client.post(
        "/api/events/",
        {
            "name": "Multipart Event",
            "starts": "2026-01-01T00:00:00Z",
            "ends": "2026-02-01T00:00:00Z",
        },
        format="multipart",
    )

    assert response.status_code == status.HTTP_201_CREATED


def test_teams_are_readable_by_anonymous_users(db: None) -> None:
    """True case test of the ReadOnly portion of our IsStaffOrReadOnly permission class."""
    now = timezone.now()
    event = Event.objects.create(name="Host Event", starts=now, ends=now)
    team = Team.objects.create(name="Red", event=event)

    response = APIClient().get("/api/teams/")
    assert response.status_code == status.HTTP_200_OK
    assert response.data["count"] == Team.objects.count()
    assert response.data["results"][0]["name"] == team.name


def test_teams_are_not_writeable_by_anonymous_users(db: None) -> None:
    """False case test of the ReadOnly portion of our IsStaffOrReadOnly permission class."""
    now = timezone.now()
    event = Event.objects.create(name="Host Event", starts=now, ends=now)
    response = APIClient().post(
        "/api/teams/", {"name": "Red", "event": event.pk}, format="json"
    )

    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.parametrize("event_count", [2, 5, 10, 20])
def test_event_list_does_not_repeatedly_query_teams(
    staff_client: APIClient, event_count: int
) -> None:
    """Ensure listing events avoids an n+1 queries issue."""

    now = timezone.now()
    for idx in range(event_count):
        event = Event.objects.create(name=f"Test Event {idx}", starts=now, ends=now)
        Team.objects.create(name=f"Test team {idx}", event=event)
        Team.objects.create(name=f"Test second team {idx}", event=event)

    with snapshot_queries() as queries:
        response = staff_client.get("/api/events/")

    assert response.status_code == status.HTTP_200_OK
    assert queries == snapshot(
        [
            "SELECT ... FROM events_event",
            "SELECT ... FROM events_event ORDER BY ... ASC LIMIT ...",
            "SELECT ... FROM events_team INNER JOIN events_event ON ... WHERE ... ORDER BY ... ASC",
        ]
    )


def test_event_write_does_not_recreate_team(staff_client: APIClient) -> None:
    """kitchen sink test covering writable-nested behavior on patch"""

    now = timezone.now()
    event = Event.objects.create(name="Test Event", starts=now, ends=now)
    team = Team.objects.create(name="Test team", event=event)  # to be renamed
    team2 = Team.objects.create(name="Test team 2", event=event)  # to be sacrificed

    event2 = Event.objects.create(
        name="Test Event 2", starts=now, ends=now
    )  # to field a bystander
    team3 = Team.objects.create(name="Test team 3", event=event2)  # to stand by

    user = User.objects.create_user(username="member", password="pw")
    profile = Profile.objects.create(user=user)
    profile.teams.set([team, team2, team3])  # to ensure relations are maintained

    response = staff_client.patch(
        f"/api/events/{event.id}/",
        {
            "teams": [
                {
                    "id": team.id,
                    "name": "renamed",
                },
                {
                    "name": "new without id",
                },
                {"id": -1, "name": "manual id"},
            ],
        },
        format="json",
    )

    assert response.status_code == status.HTTP_200_OK

    # the three on `event` (`team2` has been destroyed), plus the one on `event2`
    assert Team.objects.count() == 4

    event.refresh_from_db()
    assert event.teams.count() == 3
    assert event.teams.get(name="renamed").id == team.id
    assert event.teams.get(name="new without id")
    # turns out the default behavior *doesn't* let you set this manually,
    # i just messed around so hard i mixed myself up about it
    assert event.teams.get(name="manual id").id != -1

    profile.refresh_from_db()
    assert profile.teams.count() == 2
    assert profile.teams.get(name="renamed").id == team.id
    assert profile.teams.get(name="Test team 3").id == team3.id
