from rest_framework import serializers, viewsets

from .models import Event, Team
from .serializers import EventSerializer, TeamSerializer, TeamWriteSerializer


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()

    def get_serializer_class(self) -> type[serializers.ModelSerializer]:
        if self.request.method in ["POST", "PUT"]:
            return TeamWriteSerializer
        return TeamSerializer
