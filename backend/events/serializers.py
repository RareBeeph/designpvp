from rest_framework import serializers

from .models import Event, Team


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ["id", "name", "starts", "ends"]
        read_only_fields = ["id"]


class TeamSerializer(serializers.ModelSerializer):
    event = EventSerializer()

    class Meta:
        model = Team
        fields = ["id", "name", "event"]
        read_only_fields = ["id", "event"]


class TeamWriteSerializer(serializers.ModelSerializer):
    event = serializers.PrimaryKeyRelatedField(queryset=Event.objects.all())

    class Meta:
        model = Team
        fields = ["id", "name", "event"]
        read_only_fields = ["id"]
