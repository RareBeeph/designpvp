from rest_framework import serializers

from .models import Event


class EventSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=50)
    starts = serializers.DateTimeField()
    ends = serializers.DateTimeField()


class TeamSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=50)
    event = serializers.PrimaryKeyRelatedField(queryset=Event.objects.all())
