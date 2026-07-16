from django.contrib.auth.models import User
from rest_framework import serializers

from events.models import Team
from events.serializers import TeamSerializer

from .models import Profile


class DjangoUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "date_joined", "last_login"]


class BaseProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["id", "user", "teams"]
        read_only_fields = ["id"]


class ProfileWriteSerializer(BaseProfileSerializer):
    user = serializers.SlugRelatedField(queryset=User.objects.all(), slug_field="username")
    teams = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all(), many=True)


class ProfileSerializer(BaseProfileSerializer):
    user = DjangoUserSerializer()
    teams = TeamSerializer(many=True)
