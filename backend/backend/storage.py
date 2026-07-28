import os
import uuid

from django.db.models import Model
from django.utils.deconstruct import deconstructible


@deconstructible
class UploadTo:
    """
    An `upload_to` callable that stores uploads under `prefix` with an opaque, unique
    name.

    The name the user's browser supplied is thrown away and only its extension is kept.
    That buys three things: no path traversal via a crafted filename, no way to guess
    another user's object key, and no collisions - which matters because `file_overwrite`
    is off (see `STORAGES` in settings), so a collision would otherwise mean
    django-storages quietly appending a suffix rather than overwriting.

    This is a `@deconstructible` class rather than the more obvious factory function
    returning a closure, because `makemigrations` has to serialize whatever `upload_to`
    receives, and it can only serialize things importable by name. A closure isn't.

    ```python
    avatar = models.ImageField(upload_to=UploadTo("avatars"), blank=True)
    ```
    """

    def __init__(self, prefix: str) -> None:
        self.prefix = prefix

    def __call__(self, instance: Model, filename: str) -> str:
        extension = os.path.splitext(filename)[1].lower()
        return f"{self.prefix}/{uuid.uuid4()}{extension}"

    def __eq__(self, other: object) -> bool:
        # Without this, every `makemigrations` run sees a brand new object and emits a
        # pointless AlterField
        return isinstance(other, UploadTo) and self.prefix == other.prefix

    def __hash__(self) -> int:
        return hash((type(self), self.prefix))
