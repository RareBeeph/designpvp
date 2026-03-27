from rest_framework import serializers

from .models import Event, Team


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ["id", "name", "starts", "ends"]
        read_only_fields = ["id"]


class TeamSerializer(serializers.ModelSerializer):
    event = serializers.StringRelatedField(read_only=True)
    event_id = serializers.PrimaryKeyRelatedField(queryset=Event.objects.all())

    class Meta:
        model = Team
        fields = ["id", "name", "event", "event_id"]
        read_only_fields = ["id", "event"]
