import io
from django.http import FileResponse
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from leases.models import Lease
from notifications.models import Notification
from properties.models import Property

from .serializers import LeaseSerializer

class LeaseViewSet(ModelViewSet):

    serializer_class = LeaseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        user = self.request.user

        return Lease.objects.filter(
            landlord=user
        ) | Lease.objects.filter(
            tenant=user
        )

    def perform_create(self, serializer):

        serializer.save(
            landlord=self.request.user
        )

    def get_object(self):
        lease = super().get_object()

        if (
            lease.landlord_signed
            and lease.tenant_signed
            and lease.agreement_status != "SIGNED"
        ):
            lease.agreement_status = "SIGNED"
            lease.agreement_signed_at = (
                lease.agreement_signed_at or timezone.now()
            )
            lease.status = Lease.Status.ACTIVE
            lease.save(
                update_fields=[
                    "agreement_status",
                    "agreement_signed_at",
                    "status",
                    "updated_at",
                ]
            )

        if (
            (lease.agreement_status == "SIGNED"
             or (lease.landlord_signed and lease.tenant_signed))
            and not lease.lease_document
        ):
            lease.generate_signed_document()

        return lease

    def update(self, request, *args, **kwargs):

        lease = self.get_object()

        if lease.landlord != request.user:
            return Response(
                {
                    "success": False,
                    "message": (
                        "Only the landlord can "
                        "edit this lease."
                    ),
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        if lease.status != Lease.Status.DRAFT:
            return Response(
                {
                    "success": False,
                    "message": (
                        "Only draft leases can "
                        "be edited."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return super().update(
            request,
            *args,
            **kwargs,
        )

    def partial_update(
        self,
        request,
        *args,
        **kwargs
    ):

        lease = self.get_object()

        if lease.landlord != request.user:
            return Response(
                {
                    "success": False,
                    "message": (
                        "Only the landlord can "
                        "edit this lease."
                    ),
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        if lease.status != Lease.Status.DRAFT:
            return Response(
                {
                    "success": False,
                    "message": (
                        "Only draft leases can "
                        "be edited."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return super().partial_update(
            request,
            *args,
            **kwargs,
        )

    @action(
        detail=True,
        methods=["post"],
    )
    def send(self, request, pk=None):

        lease = self.get_object()

        if lease.landlord != request.user:
            return Response(
                {
                    "success": False,
                    "message": (
                        "Only the landlord can "
                        "send this lease."
                    ),
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        if lease.status != Lease.Status.DRAFT:
            return Response(
                {
                    "success": False,
                    "message": (
                        "Only draft leases can "
                        "be sent."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if lease.end_date <= lease.start_date:
            return Response(
                {
                    "success": False,
                    "message": (
                        "Lease end date must be "
                        "after start date."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        lease.status = Lease.Status.DRAFT
        lease.save(
            update_fields=[
                "status",
                "updated_at",
            ]
        )

        Notification.objects.create(
            user=lease.tenant,
            title="New Lease Available",
            message=(
                f"A lease for "
                f"'{lease.property.title}' "
                f"is ready for your review."
            ),
            notification_type=(
                Notification.NotificationType.PROPERTY
            ),
        )

        return Response(
            {
                "success": True,
                "message": (
                    "Lease sent to tenant "
                    "for review."
                ),
                "lease_id": str(lease.id),
            }
        )

    @action(
        detail=True,
        methods=["post"],
    )
    def accept(self, request, pk=None):

        lease = self.get_object()

        if lease.tenant != request.user:
            return Response(
                {
                    "success": False,
                    "message": (
                        "Only the tenant can "
                        "accept this lease."
                    ),
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        if lease.status != Lease.Status.DRAFT:
            return Response(
                {
                    "success": False,
                    "message": (
                        "Only a draft lease can "
                        "be accepted."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        lease.status = Lease.Status.ACTIVE

        lease.save(
            update_fields=[
                "status",
                "updated_at",
            ]
        )

        property = lease.property

        property.availability = (
            Property.Availability.RENTED
        )

        property.status = (
            Property.Status.RENTED
        )

        property.save(
            update_fields=[
                "availability",
                "status",
                "updated_at",
            ]
        )

        Notification.objects.create(
            user=lease.landlord,
            title="Lease Accepted",
            message=(
                f"The tenant has accepted the "
                f"lease for "
                f"'{property.title}'. "
                f"The property is now marked "
                f"as rented."
            ),
            notification_type=(
                Notification.NotificationType.PROPERTY
            ),
        )

        return Response(
            {
                "success": True,
                "message": (
                    "Lease accepted and property "
                    "marked as rented."
                ),
                "lease_id": str(lease.id),
            }
        )

    @action(
        detail=True,
        methods=["post"],
    )
    def reject(self, request, pk=None):

        lease = self.get_object()

        if lease.tenant != request.user:
            return Response(
                {
                    "success": False,
                    "message": (
                        "Only the tenant can "
                        "reject this lease."
                    ),
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        if lease.status != Lease.Status.DRAFT:
            return Response(
                {
                    "success": False,
                    "message": (
                        "Only a draft lease can "
                        "be rejected."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        lease.status = Lease.Status.REJECTED

        lease.save(
            update_fields=[
                "status",
                "updated_at",
            ]
        )

        Notification.objects.create(
            user=lease.landlord,
            title="Lease Rejected",
            message=(
                f"The tenant has rejected the "
                f"lease for "
                f"'{lease.property.title}'."
            ),
            notification_type=(
                Notification.NotificationType.PROPERTY
            ),
        )

        return Response(
            {
                "success": True,
                "message": "Lease rejected.",
                "lease_id": str(lease.id),
            }
        )

    @action(
        detail=True,
        methods=["post"],
    )
    def sign(self, request, pk=None):

        lease = self.get_object()
        user = request.user

        if user == lease.landlord:

            if lease.landlord_signed:
                return Response(
                    {
                        "success": False,
                        "message": (
                            "Landlord has already "
                            "signed this lease."
                        ),
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            lease.landlord_signed = True
            lease.landlord_signed_at = (
                timezone.now()
            )

        elif user == lease.tenant:

            if lease.tenant_signed:
                return Response(
                    {
                        "success": False,
                        "message": (
                            "Tenant has already "
                            "signed this lease."
                        ),
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            lease.tenant_signed = True
            lease.tenant_signed_at = (
                timezone.now()
            )

        else:

            return Response(
                {
                    "success": False,
                    "message": (
                        "You are not a party "
                        "to this lease."
                    ),
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        if (
            lease.landlord_signed
            and lease.tenant_signed
        ):

            lease.agreement_status = "SIGNED"

            lease.agreement_signed_at = (
                timezone.now()
            )

            lease.status = Lease.Status.ACTIVE

            if not lease.lease_document:
                lease.generate_signed_document()

        else:

            lease.agreement_status = (
                "PARTIALLY_SIGNED"
            )

        lease.save()

        return Response(
            {
                "success": True,
                "message": (
                    "Lease signed successfully."
                ),
                "lease_id": str(lease.id),
                "agreement_status": (
                    lease.agreement_status
                ),
                "landlord_signed": (
                    lease.landlord_signed
                ),
                "tenant_signed": (
                    lease.tenant_signed
                ),
                "lease_status": lease.status,
                "agreement_signed_at": (
                    lease.agreement_signed_at
                ),
            }
        )

        @action(
            detail=True,
            methods=["get"],
            url_path="agreement",
        )
        def agreement(self, request, pk=None):
            lease = self.get_object()

            if not lease.lease_document:
                return Response(
                    {
                        "success": False,
                        "message": "Signed lease agreement is not available yet.",
                    },
                    status=status.HTTP_404_NOT_FOUND,
                )

            return Response(
                {
                    "success": True,
                    "lease_id": str(lease.id),
                    "agreement_status": lease.agreement_status,
                    "verification_id": lease.verification_id,
                    "signed_at": lease.agreement_signed_at,
                    "document_url": request.build_absolute_uri(
                        lease.lease_document.url
                    ),
                }
            )

        @action(
            detail=True,
            methods=["get"],
            url_path="download",
        )
        def download(self, request, pk=None):
            lease = self.get_object()

            if not lease.lease_document:
                return Response(
                    {
                        "success": False,
                        "message": "Signed lease agreement is not available yet.",
                    },
                    status=status.HTTP_404_NOT_FOUND,
                )

            response = FileResponse(
                lease.lease_document.open("rb"),
                as_attachment=True,
                filename=f"HomeLink-Lease-{str(lease.id)[:8]}.pdf",
                content_type="application/pdf",
            )

            return response