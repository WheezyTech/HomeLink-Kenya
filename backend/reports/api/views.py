from django.db.migrations import serializer
from django.utils import timezone

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from accounts.models import User
from accounts.api import serializers
from notifications.models import Notification
from notifications.services import NotificationService
from properties.models import Property
from reports.models import PropertyReport

from .serializers import PropertyReportSerializer
from reports.services import ReportService

class PropertyReportViewSet(viewsets.ModelViewSet):

    serializer_class = PropertyReportSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        if self.request.user.is_staff:
            return PropertyReport.objects.all()

        return PropertyReport.objects.filter(
            reporter=self.request.user
        )

    def perform_create(self, serializer):

        property = serializer.validated_data["property"]

        if PropertyReport.objects.filter(
            property=property,
            reporter=self.request.user,
        ).exists():

            raise serializers.ValidationError(
                "You have already reported this property."
            )

        report = serializer.save(
            reporter=self.request.user
        )

        ReportService.evaluate_property(report.property)

        NotificationService.create(
            user=report.property.owner,
            title="Property Reported",
            message=f'Your property "{report.property.title}" has been reported.',
            notification_type=Notification.NotificationType.PROPERTY,
        )

        admins = User.objects.filter(is_staff=True)

        for admin in admins:
            NotificationService.create(
                user=admin,
                title="New Property Report",
                message=f'"{report.property.title}" has been reported.',
                notification_type=Notification.NotificationType.PROPERTY,
            )

    @action(
        detail=True,
        methods=["post"],
        permission_classes=[IsAdminUser],
    )
    def review(self, request, pk=None):

        report = self.get_object()

        report.status = request.data.get(
            "status",
            PropertyReport.Status.RESOLVED,
        )

        report.reviewed_by = request.user
        report.reviewed_at = timezone.now()
        report.moderator_notes = request.data.get(
            "notes",
            "",
        )

        report.save()

        return Response(
            {
                "success": True,
                "message": "Report reviewed successfully."
            },
            status=status.HTTP_200_OK,
        )