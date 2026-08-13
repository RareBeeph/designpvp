"""
Tests that the write endpoints accept what the generated client actually sends.

Neither model here has a file field, so `order_request_content_types` leaves JSON first
and the client posts a plain JSON body. Multipart is still accepted, and is covered here
too because the ordering hook is the only thing keeping these endpoints off it.
"""

import pytest
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIClient

from .models import Event, Team


@pytest.fixture
def staff_client(db: None) -> APIClient:
    api = APIClient()
    api.force_authenticate(
        user=User.objects.create_user(username="staffer", password="pw", is_staff=True)
    )
    return api


def test_event_is_created_from_a_json_body(staff_client: APIClient) -> None:
    response = staff_client.post(
        "/api/events/",
        {
            "name": "JSON Event",
            "starts": "2026-01-01T00:00:00Z",
            "ends": "2026-02-01T00:00:00Z",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_201_CREATED
    event = Event.objects.get(name="JSON Event")
    assert event.starts.year == 2026
    assert event.starts < event.ends


def test_team_is_created_from_a_json_body(staff_client: APIClient) -> None:
    now = timezone.now()
    event = Event.objects.create(name="Host Event", starts=now, ends=now)

    response = staff_client.post(
        "/api/teams/", {"name": "Red", "event": event.pk}, format="json"
    )

    assert response.status_code == status.HTTP_201_CREATED
    assert Team.objects.get(name="Red").event == event


def test_multipart_is_still_accepted(staff_client: APIClient) -> None:
    """
    Parser order only decides what the *schema* advertises first, not which parser handles
    a given request - the media types are disjoint, so every registered parser stays
    reachable.
    """
    response = staff_client.post(
        "/api/events/",
        {
            "name": "Multipart Event",
            "starts": "2026-01-01T00:00:00Z",
            "ends": "2026-02-01T00:00:00Z",
        },
        format="multipart",
    )

    assert response.status_code == status.HTTP_201_CREATED
