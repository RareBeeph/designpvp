from drf_writable_nested.serializers import WritableNestedModelSerializer
from rest_framework import serializers

from .models import Event, Team


class BaseTeamSerializer(serializers.ModelSerializer[Team]):
    class Meta:
        model = Team
        fields = ["id", "name", "event"]
        read_only_fields = ["id"]


class BaseEventSerializer(serializers.ModelSerializer[Event]):
    class Meta:
        model = Event
        fields = ["id", "name", "starts", "ends"]
        read_only_fields = ["id"]


class TeamSerializer(BaseTeamSerializer):
    event = BaseEventSerializer()


class TeamWriteSerializer(BaseTeamSerializer):
    event = serializers.PrimaryKeyRelatedField(queryset=Event.objects.all())


class TeamNestedWriteSerializer(BaseTeamSerializer):
    class Meta(BaseTeamSerializer.Meta):
        fields = [field for field in BaseTeamSerializer.Meta.fields if field != "event"]


class EventSerializer(BaseEventSerializer):
    teams = TeamSerializer(many=True)

    class Meta(BaseEventSerializer.Meta):
        fields = BaseEventSerializer.Meta.fields + ["teams"]


class EventWriteSerializer(WritableNestedModelSerializer):
    teams = TeamNestedWriteSerializer(many=True)

    class Meta(BaseEventSerializer.Meta):
        fields = BaseEventSerializer.Meta.fields + ["teams"]
