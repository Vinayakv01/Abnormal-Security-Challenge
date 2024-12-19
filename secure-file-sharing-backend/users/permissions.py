from rest_framework.permissions import BasePermission

class IsAdminUser(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "admin"


class IsRegularUser(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "user"


class IsGuestUser(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "guest"
    