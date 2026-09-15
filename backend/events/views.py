from rest_framework import serializers, viewsets

from backend.permissions import IsStaffOrReadOnly

from .models import Event, Team
from .serializers import (
    EventSerializer,
    EventWriteSerializer,
    TeamSerializer,
    TeamWriteSerializer,
)


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    permission_classes = [IsStaffOrReadOnly]

    def get_serializer_class(self) -> type[serializers.ModelSerializer]:
        if self.request.method in ["POST", "PUT", "PATCH"]:
            return EventWriteSerializer
        return EventSerializer


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    permission_classes = [IsStaffOrReadOnly]

    def get_serializer_class(self) -> type[serializers.ModelSerializer]:
        if self.request.method in ["POST", "PUT", "PATCH"]:
            return TeamWriteSerializer
        return TeamSerializer
