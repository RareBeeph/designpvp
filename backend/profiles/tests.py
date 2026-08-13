"""
Tests for who may write what to a Profile.

The rules being pinned down:

- `/api/profiles/<id>/` is staff-only for writes (`IsStaffOrReadOnly`).
- `/api/profiles/me/` lets any signed-in user edit *their own* profile, but only the
  fields `ProfileSelfWriteSerializer` exposes. `user` and `teams` are assigned elsewhere,
  so a user must not be able to move themselves between teams or reassign their profile
  to another account.
"""

import io

import pytest
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils import timezone
from PIL import Image
from rest_framework import status
from rest_framework.test import APIClient

from events.models import Event, Team

from .models import Profile

ME_URL = "/api/profiles/me/"


def make_avatar(name: str = "avatar.png") -> SimpleUploadedFile:
    """A genuinely decodable 1x1 PNG, since ImageField runs the upload through Pillow."""
    buffer = io.BytesIO()
    Image.new("RGB", (1, 1)).save(buffer, format="PNG")
    return SimpleUploadedFile(name, buffer.getvalue(), content_type="image/png")


@pytest.fixture
def teams(db: None) -> tuple[Team, Team]:
    now = timezone.now()
    event = Event.objects.create(name="Test Event", starts=now, ends=now)
    return (
        Team.objects.create(name="Red", event=event),
        Team.objects.create(name="Blue", event=event),
    )


@pytest.fixture
def profile(db: None, teams: tuple[Team, Team]) -> Profile:
    user = User.objects.create_user(username="member", password="pw")
    profile = Profile.objects.create(user=user)
    profile.teams.set([teams[0]])
    return profile


@pytest.fixture
def other_profile(db: None) -> Profile:
    other = User.objects.create_user(username="someone-else", password="pw")
    return Profile.objects.create(user=other)


@pytest.fixture
def client(profile: Profile) -> APIClient:
    """A client signed in as a plain, non-staff user who owns `profile`."""
    api = APIClient()
    api.force_authenticate(user=profile.user)
    return api


def test_user_can_set_their_own_avatar(client: APIClient, profile: Profile) -> None:
    response = client.patch(ME_URL, {"avatar": make_avatar()}, format="multipart")

    assert response.status_code == status.HTTP_200_OK
    profile.refresh_from_db()
    assert profile.avatar


def test_avatar_is_stored_under_an_opaque_key(client: APIClient, profile: Profile) -> None:
    """The uploaded filename is discarded, so keys can't be guessed or traversed."""
    client.patch(ME_URL, {"avatar": make_avatar("../../etc/passwd.png")}, format="multipart")

    profile.refresh_from_db()
    assert profile.avatar.name.startswith("avatars/")
    assert "passwd" not in profile.avatar.name
    assert ".." not in profile.avatar.name


def test_user_cannot_change_their_teams(
    client: APIClient, profile: Profile, teams: tuple[Team, Team]
) -> None:
    red, blue = teams

    response = client.patch(ME_URL, {"teams": [blue.pk]}, format="json")

    assert response.status_code == status.HTTP_200_OK
    assert list(profile.teams.all()) == [red]


def test_user_cannot_reassign_their_profile_to_another_account(
    client: APIClient, profile: Profile, other_profile: Profile
) -> None:
    response = client.patch(ME_URL, {"user": other_profile.user.pk}, format="json")

    assert response.status_code == status.HTTP_200_OK
    profile.refresh_from_db()
    assert profile.user.username == "member"


def test_anonymous_cannot_read_or_write_me(db: None) -> None:
    anonymous = APIClient()

    assert anonymous.get(ME_URL).status_code == status.HTTP_403_FORBIDDEN
    assert (
        anonymous.patch(ME_URL, {"avatar": make_avatar()}, format="multipart").status_code
        == status.HTTP_403_FORBIDDEN
    )


def test_signed_in_user_without_a_profile_gets_404(db: None) -> None:
    """
    Distinct from the 403 above. Conflating the two used to make a signed-in user who has
    no profile look logged out to the frontend.
    """
    api = APIClient()
    api.force_authenticate(
        user=User.objects.create_user(username="profileless", password="pw")
    )

    assert api.get(ME_URL).status_code == status.HTTP_404_NOT_FOUND
    assert api.patch(ME_URL, {}, format="json").status_code == status.HTTP_404_NOT_FOUND


def test_user_cannot_write_another_profile_through_the_detail_route(
    client: APIClient, other_profile: Profile
) -> None:
    response = client.patch(
        f"/api/profiles/{other_profile.pk}/", {"avatar": make_avatar()}, format="multipart"
    )

    assert response.status_code == status.HTTP_403_FORBIDDEN


def test_user_cannot_write_their_own_profile_through_the_detail_route(
    client: APIClient, profile: Profile
) -> None:
    """The detail route stays staff-only; self-service goes through `me` instead."""
    response = client.patch(
        f"/api/profiles/{profile.pk}/", {"avatar": make_avatar()}, format="multipart"
    )

    assert response.status_code == status.HTTP_403_FORBIDDEN


def test_staff_can_still_change_teams_through_the_detail_route(
    profile: Profile, teams: tuple[Team, Team]
) -> None:
    """
    Multipart because Profile carries an avatar, so `order_request_content_types` puts
    multipart first here and the generated client posts FormData. That stringifies every
    value, which is why the team pk goes over the wire as text.
    """
    _, blue = teams
    api = APIClient()
    api.force_authenticate(
        user=User.objects.create_user(username="staffer", password="pw", is_staff=True)
    )

    response = api.patch(
        f"/api/profiles/{profile.pk}/",
        {"user": profile.user.username, "teams": [str(blue.pk)]},
        format="multipart",
    )

    assert response.status_code == status.HTTP_200_OK
    assert list(profile.teams.all()) == [blue]
