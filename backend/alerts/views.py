from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import SavedSearch, PropertyAlert
from .serializers import (
    SavedSearchSerializer,
    PropertyAlertSerializer,
)


class SavedSearchViewSet(viewsets.ModelViewSet):

    serializer_class = SavedSearchSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return SavedSearch.objects.filter(
            user=self.request.user
        )

    def perform_create(self, serializer):

        serializer.save(
            user=self.request.user
        )


class PropertyAlertViewSet(viewsets.ReadOnlyModelViewSet):

    serializer_class = PropertyAlertSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return PropertyAlert.objects.filter(
            user=self.request.user
        ).select_related(
            "property",
            "saved_search",
        )

    @action(
        detail=True,
        methods=["post"],
    )
    def mark_read(self, request, pk=None):

        alert = self.get_object()

        alert.is_read = True
        alert.save(
            update_fields=["is_read"]
        )

        return Response(
            {
                "success": True,
                "message": "Alert marked as read.",
            }
        )

    @action(
        detail=False,
        methods=["post"],
    )
    def mark_all_read(self, request):

        updated = self.get_queryset().filter(
            is_read=False
        ).update(
            is_read=True
        )

        return Response(
            {
                "success": True,
                "updated": updated,
            }
        )

    @action(
        detail=False,
        methods=["get"],
    )
    def unread(self, request):

        alerts = self.get_queryset().filter(
            is_read=False
        )

        serializer = self.get_serializer(
            alerts,
            many=True,
        )

        return Response(serializer.data)