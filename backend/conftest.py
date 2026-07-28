from typing import Any

import pytest


@pytest.fixture(autouse=True)
def isolated_media_storage(settings: Any) -> None:
    """
    Point the default (media) storage at memory for every test.

    Otherwise anything touching a `FileField` would talk to the real MinIO container:
    slow, stateful across runs, and a hard dependency on a service the test suite has no
    reason to need. Autouse because forgetting it in one test is enough to leak objects
    into the development bucket.
    """
    settings.STORAGES = {
        **settings.STORAGES,
        "default": {"BACKEND": "django.core.files.storage.InMemoryStorage"},
    }
