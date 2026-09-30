from drf_writable_nested.serializers import WritableNestedModelSerializer
from rest_framework import serializers

from .models import Event, Team


class BaseTeamSerializer(serializers.ModelSerializer[Team]):
    """Serializes a team, sans relations (forward or reverse)"""

    class Meta:
        model = Team
        fields = ["id", "name"]
        read_only_fields = ["id"]


class BaseEventSerializer(serializers.ModelSerializer[Event]):
    """Serializes an event, sans relations (forward or reverse)"""

    class Meta:
        model = Event
        fields = ["id", "name", "starts", "ends"]
        read_only_fields = ["id"]


class TeamNestedSerializer(BaseTeamSerializer):
    pass


class EventNestedSerializer(BaseEventSerializer):
    pass


class TeamUnnestedSerializer(BaseTeamSerializer):
    """Includes the team's event as a nested object for more informative reads."""

    event = EventNestedSerializer()

    class Meta(BaseTeamSerializer.Meta):
        fields = BaseTeamSerializer.Meta.fields + ["event"]


class TeamUnnestedWriteSerializer(BaseTeamSerializer):
    """Includes the team's event as a primary key for easier selection during writes."""

    event = serializers.PrimaryKeyRelatedField(queryset=Event.objects.all())

    class Meta(BaseTeamSerializer.Meta):
        fields = BaseTeamSerializer.Meta.fields + ["event"]


class TeamNestedWriteSerializer(BaseTeamSerializer):
    """
    Allows the team's id to be specified to avoid recreating it during a nested write.
    Ensure proper validation checks are put in place on anything which uses this.
    """

    id = serializers.IntegerField(required=False)


class EventUnnestedSerializer(BaseEventSerializer):
    """Includes the event's teams as nested objects for more informative reads."""

    teams = TeamNestedSerializer(many=True)

    class Meta(BaseEventSerializer.Meta):
        fields = BaseEventSerializer.Meta.fields + ["teams"]


class EventWriteSerializer(WritableNestedModelSerializer):
    """Includes the event's teams as nested objects, to allow them to be created or updated during writes."""

    teams = TeamNestedWriteSerializer(many=True, required=False)

    class Meta(BaseEventSerializer.Meta):
        fields = BaseEventSerializer.Meta.fields + ["teams"]

    def validate_teams(self, teams: list[dict]) -> list[dict]:
        errors: dict = {}
        if self.instance is not None:
            existing_ids = [existing.id for existing in list(self.instance.teams.all())]

        def is_invalid(team: dict) -> bool:
            if self.instance is None:
                return "id" in team.keys()
            else:
                return "id" in team.keys() and team["id"] not in existing_ids

        for idx, team in enumerate(teams):
            if is_invalid(team):
                errors[idx] = {
                    "id": "Nested writes to an explicit team id not already on current event are forbidden."
                }

        if len(errors.keys()) > 0:
            raise serializers.ValidationError(errors)

        return teams
