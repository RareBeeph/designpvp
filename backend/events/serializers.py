from typing import Any

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
    Includes validation checks to ensure it's still de facto read-only.
    """

    # Literally only here so that create() receives the id in its validated_data.
    # Otherwise it'd successfully create a new team, with auto-incremented id.
    # Whereas we want to catch that case and throw a validation error.
    id = serializers.IntegerField(required=False)

    # It feels weird to be raising validation errors after validation,
    # but I needed access to the team's event id which only populates then.
    # It seems to work, in any case.
    def update(self, instance: Team, validated_data: Any) -> Team:
        event_id = validated_data.get("event").id

        if instance.event.id != event_id:
            # This error message is a white lie; it's really about changing a team's event.
            # I just figured we don't necessarily want the error message for an action to vary
            # based on whether the id you input already exists or not.
            raise serializers.ValidationError({"id": "Changing a team's id is forbidden."})
        return super().update(instance, validated_data)

    def create(self, validated_data: dict) -> Team:
        if "id" in validated_data.keys():
            raise serializers.ValidationError({"id": "Changing a team's id is forbidden."})
        return super().create(validated_data)


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

    # # Unused; I figured it'd be better if the validation was done on the nested serializer
    # def validate_teams(self, value: [dict]) -> [dict]:
    #     for team in value:
    #         if "id" in team.keys() and not any(
    #             [team["id"] == existing.id for existing in list(self.instance.teams.all())]
    #         ):
    #             raise serializers.ValidationError(
    #                 "Nested writes to a team id not existing on event are forbidden."
    #             )
    #     return value
