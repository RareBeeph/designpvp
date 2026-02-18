from typing import Any, Mapping

from allauth.headless.adapter import (
    DefaultHeadlessAdapter,
    EmailAddress,
    Optional,
    account_settings,
    dataclasses,
    get_user_model,
    models,
    user_display,
    user_username,
    uuid,
)
from django.contrib.auth.models import AbstractUser

# Couldn't figure out how to do this properly so I just copypasted funcs from allauth.headless.adapter so I could edit the copies


class BackendHeadlessAdapter(DefaultHeadlessAdapter):
    def get_user_dataclass(self) -> type:
        """
        Basic user data payloads are exposed in some of the headless responses. If
        you need to customize these payloads in such a way that your custom user
        payload is also reflected in the OpenAPI specification, you wil need to
        provide a ``dataclass`` representing the schema of your custom payload,
        as well as method that takes a ``User`` instance and wraps it into your
        dataclass. This method returns that ``dataclass``.
        """
        fields = []
        User = get_user_model()
        pk_field_class = type(User._meta.pk)
        if issubclass(pk_field_class, models.UUIDField):
            id_type: type[str] | type[int] = str
            id_example: str | int = str(uuid.uuid4())
        elif issubclass(pk_field_class, models.IntegerField):
            id_type = int
            id_example = 123
        else:
            id_type = str
            id_example = "uid"

        def dc_field(
            attr: str,
            typ: type | Optional[Any],
            description: str,
            example: str | int,
        ) -> tuple[str, type | Optional[Any], dict[str, Mapping[str, str | int]]]:
            return (
                attr,
                typ,
                dataclasses.field(
                    metadata={
                        "description": description,
                        "example": example,
                    }
                ),
            )

        fields.extend(
            [
                dc_field("id", Optional[id_type], "The user ID.", id_example),
                dc_field("display", str, "The display name for the user.", "Magic Wizard"),
                dc_field("email", Optional[str], "The email address.", "email@domain.org"),
                dc_field(
                    "has_usable_password",
                    bool,
                    "Whether or not the account has a password set.",
                    True,
                ),
                dc_field(
                    "is_staff",
                    bool,
                    "Whether or not the account can view the admin site",
                    False,
                ),
            ]
        )
        if account_settings.USER_MODEL_USERNAME_FIELD:
            fields.append(dc_field("username", str, "The username.", "wizard"))
        return dataclasses.make_dataclass("User", fields)

    def user_as_dataclass(self, user: AbstractUser) -> Any:
        """
        See ``get_user_dataclass()``. This method returns an instance of
        that ``dataclass``, populated with the given ``user`` fields.
        """
        UserDc = self.get_user_dataclass()
        kwargs = {}
        User = get_user_model()
        pk_field_class = type(User._meta.pk)
        if not user.pk:
            id_dc = None
        elif issubclass(pk_field_class, models.IntegerField):
            id_dc = user.pk
        else:
            id_dc = str(user.pk)
        if account_settings.USER_MODEL_USERNAME_FIELD:
            kwargs["username"] = user_username(user)
        if user.pk:
            email = EmailAddress.objects.get_primary_email(user)
        else:
            email = None
        kwargs.update(
            {
                "id": id_dc,
                "email": email if email else None,
                "display": user_display(user),
                "has_usable_password": user.has_usable_password(),
                "is_staff": user.is_staff,
            }
        )
        return UserDc(**kwargs)
