from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from applications.models import RentalApplication
from leases.models import Lease
from notifications.models import Notification
from properties.models import Property

from .serializers import RentalApplicationSerializer


class RentalApplicationViewSet(ModelViewSet):

    serializer_class = RentalApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == "TENANT":
            return RentalApplication.objects.filter(
                tenant=user
            )

        if user.role in ["LANDLORD", "AGENT"]:
            return RentalApplication.objects.filter(
                landlord=user
            )

        return RentalApplication.objects.none()

    def perform_create(self, serializer):

        property_id = self.request.data.get(
            "property"
        )

        if not property_id:
            from rest_framework.exceptions import (
                ValidationError,
            )

            raise ValidationError(
                {
                    "property": (
                        "Property is required."
                    )
                }
            )

        try:
            property = Property.objects.get(
                id=property_id
            )
        except Property.DoesNotExist:
            from rest_framework.exceptions import (
                ValidationError,
            )

            raise ValidationError(
                {
                    "property": (
                        "Property not found."
                    )
                }
            )

        if property.owner == self.request.user:
            from rest_framework.exceptions import (
                ValidationError,
            )

            raise ValidationError(
                {
                    "property": (
                        "You cannot apply for "
                        "your own property."
                    )
                }
            )

        if RentalApplication.objects.filter(
            property=property,
            tenant=self.request.user,
        ).exists():

            from rest_framework.exceptions import (
                ValidationError,
            )

            raise ValidationError(
                {
                    "property": (
                        "You have already applied "
                        "for this property."
                    )
                }
            )

        application = serializer.save(
            tenant=self.request.user,
            landlord=property.owner,
        )

        applicant_name = (
            self.request.user.get_full_name()
            or self.request.user.email
        )

        Notification.objects.create(
            user=property.owner,
            title="New Rental Application",
            message=(
                f"{applicant_name} has applied for "
                f"your property '{property.title}'."
            ),
            notification_type=(
                Notification.NotificationType.PROPERTY
            ),
        )

    @action(
        detail=True,
        methods=["post"],
    )
    def approve(self, request, pk=None):

        application = self.get_object()

        if application.landlord != request.user:
            return Response(
                {
                    "success": False,
                    "message": (
                        "Only the property landlord "
                        "can approve applications."
                    ),
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        if (
            application.status
            != RentalApplication.Status.PENDING
        ):
            return Response(
                {
                    "success": False,
                    "message": (
                        "Only pending applications "
                        "can be approved."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        application.status = (
            RentalApplication.Status.APPROVED
        )

        application.save(
            update_fields=[
                "status",
                "updated_at",
            ]
        )

        lease = Lease.objects.create(
            property=application.property,
            landlord=application.landlord,
            tenant=application.tenant,
            monthly_rent=application.property.price,
            security_deposit=application.property.price,
            start_date=timezone.now().date(),
            end_date=timezone.now().date(),
            status=Lease.Status.DRAFT,
        )

        Notification.objects.create(
            user=application.tenant,
            title="Application Approved",
            message=(
                f"Your rental application for "
                f"'{application.property.title}' "
                f"has been approved. "
                f"A draft lease has been created."
            ),
            notification_type=(
                Notification.NotificationType.PROPERTY
            ),
        )

        return Response(
            {
                "success": True,
                "message": (
                    "Application approved and "
                    "draft lease created."
                ),
                "lease_id": str(lease.id),
            }
        )

    @action(
        detail=True,
        methods=["post"],
    )
    def reject(self, request, pk=None):

        application = self.get_object()

        if application.landlord != request.user:
            return Response(
                {
                    "success": False,
                    "message": (
                        "Only the property landlord "
                        "can reject applications."
                    ),
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        if (
            application.status
            != RentalApplication.Status.PENDING
        ):
            return Response(
                {
                    "success": False,
                    "message": (
                        "Only pending applications "
                        "can be rejected."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        application.status = (
            RentalApplication.Status.REJECTED
        )

        application.save(
            update_fields=[
                "status",
                "updated_at",
            ]
        )

        Notification.objects.create(
            user=application.tenant,
            title="Application Rejected",
            message=(
                f"Your rental application for "
                f"'{application.property.title}' "
                f"has been rejected."
            ),
            notification_type=(
                Notification.NotificationType.PROPERTY
            ),
        )

        return Response(
            {
                "success": True,
                "message": (
                    "Application rejected."
                ),
            }
        )

    @action(
        detail=True,
        methods=["post"],
    )
    def cancel(self, request, pk=None):

        application = self.get_object()

        if application.tenant != request.user:
            return Response(
                {
                    "success": False,
                    "message": (
                        "Only the tenant can "
                        "cancel an application."
                    ),
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        if (
            application.status
            != RentalApplication.Status.PENDING
        ):
            return Response(
                {
                    "success": False,
                    "message": (
                        "Only pending applications "
                        "can be cancelled."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        application.status = (
            RentalApplication.Status.CANCELLED
        )

        application.save(
            update_fields=[
                "status",
                "updated_at",
            ]
        )

        tenant_name = (
            application.tenant.get_full_name()
            or application.tenant.email
        )

        Notification.objects.create(
            user=application.landlord,
            title="Application Cancelled",
            message=(
                f"{tenant_name} has cancelled their "
                f"application for "
                f"'{application.property.title}'."
            ),
            notification_type=(
                Notification.NotificationType.PROPERTY
            ),
        )

        return Response(
            {
                "success": True,
                "message": (
                    "Application cancelled."
                ),
            }
        )