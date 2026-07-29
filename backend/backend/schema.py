from drf_standardized_errors.openapi import AutoSchema as StandardizedErrorsAutoSchema
from rest_framework.permissions import AllowAny


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
