"""
Tests for `backend.schema.order_request_content_types`.

orval generates a client against whichever request content type an operation advertises
first, so this ordering decides what the frontend actually sends. Getting it wrong is
quiet: the schema stays valid, the client still compiles, and the break only shows up as a
failed request at runtime.
"""

import json
from typing import Any

import pytest
from rest_framework.test import APIClient

MULTIPART = "multipart/form-data"
JSON = "application/json"


@pytest.fixture
def schema(db: None) -> dict[str, Any]:
    # The real endpoint rather than the generator, so the postprocessing hooks run exactly
    # as they do for `npm run api:generate`
    response = APIClient().get("/api/schema/", {"format": "json"})
    assert response.status_code == 200
    parsed: dict[str, Any] = json.loads(response.content)
    return parsed


def first_content_type(schema: dict[str, Any], path: str, method: str) -> str:
    name: str = next(iter(schema["paths"][path][method]["requestBody"]["content"]))
    return name


def content_types(schema: dict[str, Any], path: str, method: str) -> list[str]:
    return list(schema["paths"][path][method]["requestBody"]["content"])


def test_operations_taking_an_upload_advertise_multipart_first(
    schema: dict[str, Any],
) -> None:
    assert first_content_type(schema, "/api/profiles/me/", "patch") == MULTIPART
    assert first_content_type(schema, "/api/profiles/{id}/", "patch") == MULTIPART
    assert first_content_type(schema, "/api/profiles/{id}/", "put") == MULTIPART


def test_operations_without_an_upload_advertise_json_first(schema: dict[str, Any]) -> None:
    """
    JSON is what a nested writable body (drf-writable-nested) needs: multipart flattens
    everything into a QueryDict and cannot represent nesting at all.
    """
    assert first_content_type(schema, "/api/events/", "post") == JSON
    assert first_content_type(schema, "/api/teams/", "post") == JSON
    assert first_content_type(schema, "/api/events/{id}/", "patch") == JSON


def test_reordering_drops_nothing(schema: dict[str, Any]) -> None:
    """Only the order changes - every content type stays advertised and accepted."""
    for path, method in (("/api/profiles/{id}/", "patch"), ("/api/events/", "post")):
        assert set(content_types(schema, path, method)) == {
            JSON,
            MULTIPART,
            "application/x-www-form-urlencoded",
        }
