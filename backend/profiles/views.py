from rest_framework import serializers, status, viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from backend.permissions import IsStaffOrReadOnly

from .models import Profile
from .serializers import ProfileSerializer, ProfileWriteSerializer


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    permission_classes = [IsStaffOrReadOnly]

    def get_serializer_class(self) -> type[serializers.ModelSerializer]:
        if self.request.method in ["POST", "PUT", "PATCH"]:
            return ProfileWriteSerializer
        return ProfileSerializer

    @action(detail=False, methods=["GET"])
    def me(self, request: Request) -> Response:
        if request.user.id:
            profile = Profile.objects.filter(user=request.user).first()
            if profile:
                return Response(ProfileSerializer(profile).data)
        return Response(status=status.HTTP_401_UNAUTHORIZED)
