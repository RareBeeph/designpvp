from typing import Any

from drf_standardized_errors.openapi import AutoSchema as StandardizedErrorsAutoSchema
from rest_framework.permissions import AllowAny

MULTIPART = "multipart/form-data"
JSON = "application/json"


class AutoSchema(StandardizedErrorsAutoSchema):
    """
    drf-standardized-errors' schema, corrected for session auth.

    Its 401/403 detection assumes an unauthenticated request produces a 401. That only
    happens when the first authenticator returns a `WWW-Authenticate` challenge;
    `SessionAuthentication` returns `None`, so `APIView.handle_exception` downgrades
    `NotAuthenticated` to 403 instead.
    """

    def _emits_auth_challenge(self) -> bool:
        return bool(self.view.get_authenticate_header(self.view.request))

    def _should_add_http401_error_response(self) -> bool:
        return self._emits_auth_challenge() and super()._should_add_http401_error_response()

    def _should_add_http403_error_response(self) -> bool:
        if self._emits_auth_challenge():
            return super()._should_add_http403_error_response()

        # the parent skips 403 when IsAuthenticated is the only permission class, because
        # it expects a 401 instead. Without a challenge header that 401 never happens, so
        # apply its rule minus that carve-out
        permissions = self.view.get_permissions()
        is_allow_any = len(permissions) == 1 and type(permissions[0]) is AllowAny
        return bool(permissions) and not is_allow_any


def _contains_binary(
    schema: dict[str, Any], components: dict[str, Any], seen: set[str] | None = None
) -> bool:
    """
    Whether `schema` has a file anywhere in it, following `$ref`s into `components`.

    drf-spectacular renders a `FileField`/`ImageField` as `{"type": "string", "format":
    "binary"}`, so that is the marker. `seen` guards against a self-referential component.
    """
    seen = set() if seen is None else seen

    ref = schema.get("$ref")
    if ref:
        name = ref.rsplit("/", 1)[-1]
        if name in seen:
            return False
        return _contains_binary(components.get(name, {}), components, seen | {name})

    if schema.get("format") == "binary":
        return True

    for key in ("items", "additionalProperties"):
        nested = schema.get(key)
        if isinstance(nested, dict) and _contains_binary(nested, components, seen):
            return True

    for nested in schema.get("properties", {}).values():
        if _contains_binary(nested, components, seen):
            return True

    for key in ("allOf", "oneOf", "anyOf"):
        for nested in schema.get(key, []):
            if _contains_binary(nested, components, seen):
                return True

    return False


def order_request_content_types(
    result: dict[str, Any], generator: Any, request: Any, public: bool
) -> dict[str, Any]:
    """
    Put the content type each operation should actually be called with first.

    orval generates a client against the *first* request content type an operation
    advertises, and drf-spectacular emits them in `parser_classes` order. A single global
    parser order therefore cannot be right for the whole API: endpoints taking an upload
    need `multipart/form-data`, but multipart flattens everything into a `QueryDict`, so
    anything with a nested writable body (drf-writable-nested) needs `application/json`.

    Deciding per operation removes the conflict, and removes the need for individual
    viewsets to reorder `parser_classes` just to steer codegen. Every content type stays
    advertised and accepted - only the order changes.
    """
    components = result.get("components", {}).get("schemas", {})

    for path in result.get("paths", {}).values():
        for operation in path.values():
            if not isinstance(operation, dict):
                continue  # e.g. a shared "parameters" list

            content = operation.get("requestBody", {}).get("content")
            if not content:
                continue

            takes_a_file = any(
                _contains_binary(entry.get("schema", {}), components)
                for entry in content.values()
            )
            preferred = MULTIPART if takes_a_file else JSON
            if preferred not in content:
                continue

            operation["requestBody"]["content"] = {
                preferred: content[preferred],
                **{name: entry for name, entry in content.items() if name != preferred},
            }

    return result
