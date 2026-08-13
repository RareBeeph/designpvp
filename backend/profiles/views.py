from django.http import Http404
from drf_spectacular.utils import extend_schema
from drf_standardized_errors.openapi_serializers import ErrorResponse404Serializer
from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from backend.permissions import IsStaffOrReadOnly
from backend.request import AuthenticatedRequest

from .models import Profile
from .serializers import ProfileSelfWriteSerializer, ProfileSerializer, ProfileWriteSerializer


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    permission_classes = [IsStaffOrReadOnly]

    def get_serializer_class(self) -> type[serializers.ModelSerializer]:
        if self.request.method in ["POST", "PUT", "PATCH"]:
            return ProfileWriteSerializer
        return ProfileSerializer

    def get_own_profile(self, request: AuthenticatedRequest) -> Profile:
        """
        Resolve the requesting user's profile.

        The lookup is keyed on `request.user` rather than a URL argument, so there is no
        id for a caller to tamper with - the `me` routes cannot address anybody else's
        profile. A logged-in user who somehow has no profile gets a 404, which is distinct
        from the 403 an anonymous caller gets from `IsAuthenticated`.
        """
        if not hasattr(request.user, "profile"):
            raise Http404
        return request.user.profile

    # 404 is declared explicitly because nothing in the operation implies it - `me` takes no
    # path parameter, so drf-standardized-errors has no reason to expect one
    @extend_schema(responses={200: ProfileSerializer, 404: ErrorResponse404Serializer})
    @action(detail=False, methods=["GET"], permission_classes=[IsAuthenticated])
    def me(self, request: AuthenticatedRequest) -> Response:
        return Response(self.get_serializer(self.get_own_profile(request)).data)

    @extend_schema(
        # `get_serializer_class` would hand PATCH the staff-facing ProfileWriteSerializer,
        # which advertises `user` and `teams` as writable. This is about picking the right
        # serializer, not the content type - multipart wins that on parser order
        request=ProfileSelfWriteSerializer,
        responses={200: ProfileSerializer, 404: ErrorResponse404Serializer},
    )
    @me.mapping.patch
    def update_me(self, request: AuthenticatedRequest) -> Response:
        profile = self.get_own_profile(request)
        serializer = ProfileSelfWriteSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        # Respond with the nested read shape so the client can drop the result straight
        # into the same cache entry the GET populates
        return Response(ProfileSerializer(profile).data)
