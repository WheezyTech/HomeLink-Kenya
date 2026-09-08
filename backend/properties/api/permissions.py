from rest_framework.permissions import BasePermission, SAFE_METHODS


class PropertyPermission(BasePermission):

    def has_permission(self, request, view):

        # Anyone can view public properties
        if request.method in SAFE_METHODS:
            return True

        # Only authenticated landlords and agents
        # can create/update/delete properties
        if not request.user or not request.user.is_authenticated:
            return False

        return request.user.role in [
            "LANDLORD",
            "AGENT",
        ]

    def has_object_permission(self, request, view, obj):

        # Anyone can view
        if request.method in SAFE_METHODS:
            return True

        # Only the owner can modify their property
        return obj.owner == request.user