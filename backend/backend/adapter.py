import dataclasses

from allauth.headless.adapter import DefaultHeadlessAdapter
from django.contrib.auth.models import AbstractUser


class BackendHeadlessAdapter(DefaultHeadlessAdapter):
    def get_user_dataclass(self) -> type:
        dc = super().get_user_dataclass()
        fields = [
            (
                "is_staff",
                bool,
                dataclasses.field(
                    metadata={
                        "description": "Whether or not the account can view the admin site.",
                        "example": False,
                    }
                ),
            )
        ]
        return dataclasses.make_dataclass("User", fields, bases=(dc,))

    def user_as_dataclass(self, user: AbstractUser) -> object:
        UserDc = self.get_user_dataclass()
        kwargs = dataclasses.asdict(DefaultHeadlessAdapter(self).user_as_dataclass(user))
        kwargs.update({"is_staff": user.is_staff})
        return UserDc(**kwargs)
