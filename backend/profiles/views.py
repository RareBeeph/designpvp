from drf_spectacular.utils import extend_schema
from drf_standardized_errors.openapi_serializers import ErrorResponse404Serializer
from rest_framework import serializers, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from backend.permissions import IsStaffOrReadOnly
from backend.request import AuthenticatedRequest

from .models import Profile
from .serializers import ProfileSerializer, ProfileWriteSerializer


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    permission_classes = [IsStaffOrReadOnly]

    def get_serializer_class(self) -> type[serializers.ModelSerializer]:
        if self.request.method in ["POST", "PUT", "PATCH"]:
            return ProfileWriteSerializer
        return ProfileSerializer

    # 404 is declared explicitly because nothing in the operation implies it - `me` takes no
    # path parameter, so drf-standardized-errors has no reason to expect one
    @extend_schema(responses={200: ProfileSerializer, 404: ErrorResponse404Serializer})
    @action(detail=False, methods=["GET"], permission_classes=[IsAuthenticated])
    def me(self, request: AuthenticatedRequest) -> Response:
        try:
            profile = request.user.profile
        except Profile.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(self.get_serializer(profile).data)
