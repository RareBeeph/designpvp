from rest_framework import serializers, viewsets
from rest_framework.permissions import (
    IsAdminUser,
    IsAuthenticated,
    IsAuthenticatedOrReadOnly,
)

from .models import Event, Team
from .serializers import EventSerializer, TeamSerializer, TeamWriteSerializer

IsReadOnly = IsAuthenticatedOrReadOnly & ~IsAuthenticated
IsStaffOrReadOnly = IsAdminUser | IsReadOnly


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsStaffOrReadOnly]


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    permission_classes = [IsStaffOrReadOnly]

    def get_serializer_class(self) -> type[serializers.ModelSerializer]:
        if self.request.method in ["POST", "PUT", "PATCH"]:
            return TeamWriteSerializer
        return TeamSerializer
