from django.contrib.auth.models import User
from rest_framework import serializers

from events.models import Team

from .models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    teams = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all(), many=True)

    class Meta:
        model = Profile
        fields = ["id", "user", "teams"]
        read_only_fields = ["id"]
