from datetime import timedelta

from django.db import transaction
from django.db.models import Q
from django.utils import timezone

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from bookings.models import Booking
from leases.models import Lease
from properties.models import Property, PropertyAnalytics

from notifications.models import Notification
from notifications.services import NotificationService

from .serializers import BookingSerializer


class BookingViewSet(viewsets.ModelViewSet):

    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        user = self.request.user

        return Booking.objects.filter(
            Q(tenant=user) |
            Q(landlord=user) |
            Q(property__agent=user)
        ).select_related(
            "property",
            "tenant",
            "landlord",
            "completed_by",
        ).order_by("-created_at")

    def create(self, request, *args, **kwargs):

        property_id = request.data.get("property")

        try:
            property = Property.objects.get(
                id=property_id,
                status=Property.Status.APPROVED,
            )

        except Property.DoesNotExist:

            return Response(
                {
                    "success": False,
                    "message": "Property not found or is not available."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        # Owner cannot book own property
        if property.owner == request.user:

            return Response(
                {
                    "success": False,
                    "message": "You cannot book your own property."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Only tenants should create viewing bookings
        if request.user.role != "TENANT":

            return Response(
                {
                    "success": False,
                    "message": "Only tenants can request property viewings."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        viewing_date = request.data.get("viewing_date")
        viewing_time = request.data.get("viewing_time")

        # Prevent duplicate time slots
        if Booking.objects.filter(
            property=property,
            viewing_date=viewing_date,
            viewing_time=viewing_time,
            status__in=[
                Booking.Status.PENDING,
                Booking.Status.ACCEPTED,
            ],
        ).exists():

            return Response(
                {
                    "success": False,
                    "message": "This time slot is already booked."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        booking = serializer.save(
            tenant=request.user,
            landlord=property.owner,
        )

        analytics, _ = PropertyAnalytics.objects.get_or_create(
            property=property
        )

        analytics.bookings += 1
        analytics.calculate_score()
        analytics.save(update_fields=["bookings", "popularity_score"])

        # Notify owner
        NotificationService.create(
            user=property.owner,
            title="New Viewing Request",
            message=(
                f'{request.user.get_full_name() or request.user.email} '
                f'requested to view "{property.title}".'
            ),
            notification_type=Notification.NotificationType.BOOKING,
        )

        if property.agent and property.agent != property.owner:
            NotificationService.create(
                user=property.agent,
                title="New Viewing Request",
                message=(
                    f'{request.user.get_full_name() or request.user.email} '
                    f'requested to view "{property.title}".'
                ),
                notification_type=Notification.NotificationType.BOOKING,
            )

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )

    # --------------------------------------------------
    # ACCEPT BOOKING
    # --------------------------------------------------

    @action(
        detail=True,
        methods=["post"],
    )
    def accept(self, request, pk=None):

        booking = self.get_object()

        if booking.landlord != request.user and (
            booking.property.agent != request.user
        ):

            return Response(
                {
                    "success": False,
                    "message": "You are not authorized to manage this booking."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        if booking.status != Booking.Status.PENDING:

            return Response(
                {
                    "success": False,
                    "message": "Only pending bookings can be accepted."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        booking.status = Booking.Status.ACCEPTED
        booking.owner_notes = request.data.get(
            "owner_notes",
            booking.owner_notes,
        )

        booking.save()

        # Notify tenant
        NotificationService.create(
            user=booking.tenant,
            title="Viewing Request Accepted",
            message=(
                f'Your viewing request for "{booking.property.title}" '
                f'has been accepted.'
            ),
            notification_type=Notification.NotificationType.BOOKING,
        )

        return Response(
            {
                "success": True,
                "message": "Booking accepted successfully.",
                "booking": BookingSerializer(
                    booking
                ).data,
            }
        )

    @action(detail=True, methods=["post"])
    def request_lease(self, request, pk=None):
        booking = self.get_object()

        if booking.tenant != request.user:
            return Response(
                {"success": False, "message": "Only the tenant can request this lease."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if booking.status != Booking.Status.COMPLETED:
            return Response(
                {"success": False, "message": "The viewing must be completed before requesting a lease."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            lease = Lease.objects.filter(
                property=booking.property,
                tenant=booking.tenant,
                landlord=booking.landlord,
                status__in=[Lease.Status.DRAFT, Lease.Status.ACTIVE],
            ).first()

            if lease is None:
                start_date = timezone.localdate()
                lease = Lease.objects.create(
                    property=booking.property,
                    landlord=booking.landlord,
                    tenant=booking.tenant,
                    monthly_rent=booking.property.price,
                    security_deposit=booking.property.price,
                    start_date=start_date,
                    end_date=start_date + timedelta(days=365),
                )

            NotificationService.create(
                user=booking.landlord,
                title="Lease Requested",
                message=(
                    f'{booking.tenant.get_full_name() or booking.tenant.email} '
                    f'requested a lease for "{booking.property.title}".'
                ),
                notification_type=Notification.NotificationType.BOOKING,
            )

        return Response(
            {
                "success": True,
                "message": "Lease created. You can now review and sign it.",
                "lease_id": str(lease.id),
            },
            status=status.HTTP_201_CREATED,
        )

    # --------------------------------------------------
    # REJECT BOOKING
    # --------------------------------------------------

    @action(
        detail=True,
        methods=["post"],
    )
    def reject(self, request, pk=None):

        booking = self.get_object()

        if booking.landlord != request.user and (
            booking.property.agent != request.user
        ):

            return Response(
                {
                    "success": False,
                    "message": "You are not authorized to manage this booking."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        if booking.status != Booking.Status.PENDING:

            return Response(
                {
                    "success": False,
                    "message": "Only pending bookings can be rejected."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        booking.status = Booking.Status.REJECTED
        booking.owner_notes = request.data.get(
            "owner_notes",
            "",
        )

        booking.save()

        # Notify tenant
        NotificationService.create(
            user=booking.tenant,
            title="Viewing Request Rejected",
            message=(
                f'Your viewing request for "{booking.property.title}" '
                f'was rejected.'
            ),
            notification_type=Notification.NotificationType.BOOKING,
        )

        return Response(
            {
                "success": True,
                "message": "Booking rejected successfully.",
            }
        )

    # --------------------------------------------------
    # CHECK IN TENANT
    # --------------------------------------------------

    @action(
        detail=True,
        methods=["post"],
    )
    def check_in(self, request, pk=None):

        booking = self.get_object()

        if booking.landlord != request.user:

            return Response(
                {
                    "success": False,
                    "message": "You are not the owner of this booking."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        if booking.status != Booking.Status.ACCEPTED:

            return Response(
                {
                    "success": False,
                    "message": "Only accepted bookings can be checked in."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        booking.checked_in = True
        booking.save(
            update_fields=[
                "checked_in",
                "updated_at",
            ]
        )

        NotificationService.create(
            user=booking.tenant,
            title="Viewing Check-In",
            message=(
                f'You have been checked in for the viewing of '
                f'"{booking.property.title}".'
            ),
            notification_type=Notification.NotificationType.BOOKING,
        )

        return Response(
            {
                "success": True,
                "message": "Tenant checked in successfully.",
            }
        )

    # --------------------------------------------------
    # COMPLETE BOOKING
    # --------------------------------------------------

    @action(
        detail=True,
        methods=["post"],
    )
    def complete(self, request, pk=None):

        booking = self.get_object()

        if booking.landlord != request.user:

            return Response(
                {
                    "success": False,
                    "message": "You are not the owner of this booking."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        if booking.status != Booking.Status.ACCEPTED:

            return Response(
                {
                    "success": False,
                    "message": "Only accepted bookings can be completed."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        booking.status = Booking.Status.COMPLETED
        booking.completed_by = request.user

        booking.save()

        NotificationService.create(
            user=booking.tenant,
            title="Viewing Completed",
            message=(
                f'The viewing for "{booking.property.title}" '
                f'has been marked as completed.'
            ),
            notification_type=Notification.NotificationType.BOOKING,
        )

        return Response(
            {
                "success": True,
                "message": "Viewing marked as completed.",
            }
        )

    # --------------------------------------------------
    # CANCEL BOOKING
    # --------------------------------------------------

    @action(
        detail=True,
        methods=["post"],
    )
    def cancel(self, request, pk=None):

        booking = self.get_object()

        if booking.status not in [
            Booking.Status.PENDING,
            Booking.Status.ACCEPTED,
        ]:

            return Response(
                {
                    "success": False,
                    "message": "This booking cannot be cancelled."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Tenant or owner can cancel
        if (
            booking.tenant != request.user
            and booking.landlord != request.user
        ):

            return Response(
                {
                    "success": False,
                    "message": "You cannot cancel this booking."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        reason = request.data.get(
            "reason",
            "",
        )

        booking.status = Booking.Status.CANCELLED
        booking.cancellation_reason = reason

        booking.save()

        # Notify the other party
        recipient = (
            booking.landlord
            if request.user == booking.tenant
            else booking.tenant
        )

        NotificationService.create(
            user=recipient,
            title="Viewing Cancelled",
            message=(
                f'The viewing for "{booking.property.title}" '
                f'has been cancelled.'
            ),
            notification_type=Notification.NotificationType.BOOKING,
        )

        return Response(
            {
                "success": True,
                "message": "Booking cancelled successfully.",
            }
        )

    # --------------------------------------------------
    # OWNER BOOKINGS
    # --------------------------------------------------

    @action(
        detail=False,
        methods=["get"],
    )
    def incoming(self, request):

        if request.user.role not in [
            "LANDLORD",
            "AGENT",
        ]:

            return Response(
                {
                    "success": False,
                    "message": "Only landlords and agents can view incoming bookings."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        bookings = Booking.objects.filter(
            Q(landlord=request.user) |
            Q(property__agent=request.user)
        ).select_related(
            "property",
            "tenant",
        ).order_by("-created_at")

        serializer = self.get_serializer(
            bookings,
            many=True,
        )

        return Response(serializer.data)