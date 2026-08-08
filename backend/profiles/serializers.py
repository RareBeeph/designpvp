from django.contrib.auth.models import User
from rest_framework import serializers

from events.models import Team
from events.serializers import TeamSerializer

from .models import Profile


class DjangoUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "date_joined"]


class BaseProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["id", "user", "teams", "avatar"]
        read_only_fields = ["id"]


class ProfileWriteSerializer(BaseProfileSerializer):
    user = serializers.SlugRelatedField(queryset=User.objects.all(), slug_field="username")
    teams = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all(), many=True)


class ProfileSelfWriteSerializer(BaseProfileSerializer):
    """
    The subset of fields a user may change on their *own* profile, used by the `me`
    action. `user` and `teams` are assigned elsewhere and stay read-only here, so a user
    cannot reassign themselves to another account or switch teams. `id` is already
    read-only on the base.
    """

    class Meta(BaseProfileSerializer.Meta):
        read_only_fields = BaseProfileSerializer.Meta.read_only_fields + ["user", "teams"]


class ProfileSerializer(BaseProfileSerializer):
    user = DjangoUserSerializer()
    teams = TeamSerializer(many=True)
