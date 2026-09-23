from rest_framework import serializers, viewsets

from backend.permissions import IsStaffOrReadOnly

from .models import Event, Team
from .serializers import (
    EventUnnestedSerializer,
    EventWriteSerializer,
    TeamUnnestedSerializer,
    TeamUnnestedWriteSerializer,
)


class EventViewSet(viewsets.ModelViewSet):
    # dang, guess not everything is auto-prefetched.
    # makes sense in retrospect that reverse relations wouldn't be, though
    queryset = Event.objects.all().prefetch_related("teams")
    permission_classes = [IsStaffOrReadOnly]

    def get_serializer_class(self) -> type[serializers.ModelSerializer]:
        if self.request.method in ["POST", "PUT", "PATCH"]:
            return EventWriteSerializer
        return EventUnnestedSerializer


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    permission_classes = [IsStaffOrReadOnly]

    def get_serializer_class(self) -> type[serializers.ModelSerializer]:
        if self.request.method in ["POST", "PUT", "PATCH"]:
            return TeamUnnestedWriteSerializer
        return TeamUnnestedSerializer
