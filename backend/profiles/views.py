from rest_framework import serializers, viewsets

from events.views import (
    IsStaffOrReadOnly,  # consider relocating this to somewhere more appropriate to share from
)

from .models import Profile
from .serializers import ProfileSerializer, ProfileWriteSerializer


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    permission_classes = [IsStaffOrReadOnly]

    def get_serializer_class(self) -> type[serializers.ModelSerializer]:
        if self.request.method in ["POST", "PUT", "PATCH"]:
            return ProfileWriteSerializer
        return ProfileSerializer
