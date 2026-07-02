from rest_framework.permissions import (
    IsAdminUser,
    IsAuthenticated,
    IsAuthenticatedOrReadOnly,
)

IsReadOnly = IsAuthenticatedOrReadOnly & ~IsAuthenticated
IsStaffOrReadOnly = IsAdminUser | IsReadOnly
