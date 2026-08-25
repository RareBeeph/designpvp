from rest_framework import serializers

from .models import Event, Team


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ["id", "name", "starts", "ends"]
        read_only_fields = ["id"]


class BaseTeamSerializer(serializers.ModelSerializer):
    class Meta:
        # queryset = Team.objects.prefetch_related("profiles") # Include this when we add "profiles" to Team fields

        model = Team
        fields = ["id", "name", "event"]
        read_only_fields = ["id"]


class TeamSerializer(BaseTeamSerializer):
    event = EventSerializer()


class TeamWriteSerializer(BaseTeamSerializer):
    event = serializers.PrimaryKeyRelatedField(queryset=Event.objects.all())
