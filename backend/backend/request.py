from django.contrib.auth.models import User
from rest_framework.request import Request


class AuthenticatedRequest(Request):
    """
    A `Request` whose view is guarded by `IsAuthenticated`, so `user` is never anonymous.

    This exists purely to narrow types and is never instantiated - DRF still passes a plain
    `Request` at runtime. drf-stubs types `Request.user` as `User | AnonymousUser`, so every
    use of a `User`-only attribute (`request.user.profile`, a `user=` queryset lookup) fails
    mypy on the `AnonymousUser` half of the union.

    Annotating a handler with this is a promise that a permission class already makes
    anonymous access impossible. Only use it where that is actually enforced.

    In a serializer the request has to be pulled out of `self.context` with an explicit
    annotation, because drf-stubs types `context` as `dict[str, Any]`::

        request: AuthenticatedRequest = self.context["request"]

    A viewset whose every action requires authentication can instead declare
    `request: AuthenticatedRequest` in its class body, which covers `self.request`.
    """

    user: User
