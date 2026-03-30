from typing import Any

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

User = get_user_model()


class Command(BaseCommand):
    help = "Promotes the latest user to staff and superuser."

    def handle(self, *args: Any, **kwargs: Any) -> None:
        user = User.objects.latest("date_joined")
        user.is_staff = True
        user.is_superuser = True
        user.save(update_fields=["is_staff", "is_superuser"])
        self.stdout.write(self.style.SUCCESS(f"Promoted {user.username} to staff/superuser."))
