from rest_framework.permissions import SAFE_METHODS, BasePermission, IsAdminUser, OperandHolder
from rest_framework.request import Request
from rest_framework.views import APIView


class IsReadOnly(BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        return bool(request.method in SAFE_METHODS)


IsStaffOrReadOnly: OperandHolder = IsAdminUser | IsReadOnly
