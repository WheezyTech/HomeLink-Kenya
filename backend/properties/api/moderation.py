from django.utils import timezone

from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from notifications.models import Notification
from notifications.services import NotificationService


class PropertyModerationMixin:

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[IsAdminUser],
    )
    def pending(self, request):

        queryset = self.get_queryset().filter(
            status=self.queryset.model.Status.PENDING
        )

        serializer = self.get_serializer(
            queryset,
            many=True,
        )

        return Response(serializer.data)

    @action(
        detail=True,
        methods=["post"],
        permission_classes=[IsAdminUser],
    )
    def approve(self, request, pk=None):

        property = self.get_object()

        property.status = property.Status.APPROVED
        property.approved_by = request.user
        property.approved_at = timezone.now()
        property.rejection_reason = ""

        property.save()

        NotificationService.create(
            user=property.owner,
            title="Property Approved",
            message=f'Your property "{property.title}" has been approved.',
            notification_type=Notification.NotificationType.PROPERTY,
        )

        return Response(
            {
                "success": True,
                "message": "Property approved.",
            }
        )

    @action(
        detail=True,
        methods=["post"],
        permission_classes=[IsAdminUser],
    )
    def reject(self, request, pk=None):

        property = self.get_object()

        property.status = property.Status.REJECTED
        property.approved_by = request.user
        property.approved_at = timezone.now()
        property.rejection_reason = request.data.get(
            "reason",
            "No reason provided.",
        )

        property.save()

        NotificationService.create(
            user=property.owner,
            title="Property Rejected",
            message=property.rejection_reason,
            notification_type=Notification.NotificationType.PROPERTY,
        )

        return Response(
            {
                "success": True,
                "message": "Property rejected.",
            }
        )

    @action(
        detail=True,
        methods=["post"],
        permission_classes=[IsAdminUser],
    )
    def verify(self, request, pk=None):

        property = self.get_object()

        property.is_verified = True
        property.verification_notes = request.data.get(
            "notes",
            "",
        )

        property.save()

        NotificationService.create(
            user=property.owner,
            title="Property Verified",
            message=f'Your property "{property.title}" is now verified.',
            notification_type=Notification.NotificationType.PROPERTY,
        )

        return Response(
            {
                "success": True,
                "message": "Property verified.",
            }
        )