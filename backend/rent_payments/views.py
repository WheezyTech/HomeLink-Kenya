from datetime import date

from django.http import HttpResponse
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from payments.services import MpesaService
from rent_payments.models import RentPayment

from .receipt import generate_rent_receipt
from .serializers import RentPaymentSerializer


class RentPaymentViewSet(ModelViewSet):

    serializer_class = RentPaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        user = self.request.user

        if user.role == "TENANT":
            queryset = RentPayment.objects.filter(
                tenant=user
            )

        else:
            queryset = RentPayment.objects.filter(
                landlord=user
            )

        lease_id = self.request.query_params.get("lease")

        if lease_id:
            queryset = queryset.filter(
                lease_id=lease_id
            )

        return queryset

    def perform_create(self, serializer):

        lease = serializer.validated_data["lease"]

        if lease.landlord != self.request.user:
            raise PermissionDenied(
                "Only the landlord can create "
                "rent records for this lease."
            )

        if lease.status != "ACTIVE":
            raise PermissionDenied(
                "Rent can only be created for "
                "an active lease."
            )

        serializer.save(
            tenant=lease.tenant,
            landlord=lease.landlord,
            amount_due=lease.monthly_rent,
        )

    @action(
        detail=True,
        methods=["post"],
    )
    def pay(self, request, pk=None):

        rent = self.get_object()

        # Only the tenant can initiate payment
        if rent.tenant != request.user:
            return Response(
                {
                    "success": False,
                    "message": (
                        "Only the tenant can "
                        "pay this rent."
                    ),
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        # Prevent payment when already fully paid
        if rent.status == RentPayment.Status.PAID:
            return Response(
                {
                    "success": False,
                    "message": (
                        "This rent payment is "
                        "already fully paid."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Calculate remaining balance
        remaining_balance = (
            rent.amount_due - rent.amount_paid
        )

        if remaining_balance <= 0:
            return Response(
                {
                    "success": False,
                    "message": "No balance is due.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        phone_number = request.data.get(
            "phone_number"
        )

        if not phone_number:
            return Response(
                {
                    "success": False,
                    "message": (
                        "Phone number is required."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:

            response = MpesaService.stk_push(
                phone_number=phone_number,
                amount=remaining_balance,
                account_reference=str(rent.id),
                transaction_desc=(
                    f"Rent - "
                    f"{rent.property.title}"
                ),
            )

            rent.phone_number = phone_number

            rent.merchant_request_id = response.get(
                "MerchantRequestID",
                "",
            )

            rent.checkout_request_id = response.get(
                "CheckoutRequestID",
                "",
            )

            rent.payment_reference = str(
                rent.id
            )

            rent.status = RentPayment.Status.PENDING

            rent.save(
                update_fields=[
                    "phone_number",
                    "merchant_request_id",
                    "checkout_request_id",
                    "payment_reference",
                    "status",
                    "updated_at",
                ]
            )

            return Response(
                {
                    "success": True,
                    "message": (
                        "M-Pesa STK Push sent "
                        "successfully."
                    ),
                    "rent_payment_id": str(
                        rent.id
                    ),
                    "amount": str(
                        remaining_balance
                    ),
                    "checkout_request_id": (
                        rent.checkout_request_id
                    ),
                },
                status=status.HTTP_201_CREATED,
            )

        except Exception as e:

            rent.status = RentPayment.Status.FAILED
            rent.notes = str(e)

            rent.save(
                update_fields=[
                    "status",
                    "notes",
                    "updated_at",
                ]
            )

            return Response(
                {
                    "success": False,
                    "message": str(e),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

    @action(
        detail=True,
        methods=["get"],
        url_path="receipt",
    )
    def receipt(self, request, pk=None):
        rent = self.get_object()
        # Only tenant or landlord can download receipt
        if (
            rent.tenant != request.user
            and rent.landlord != request.user
        ):
            return Response(
                {
                    "success": False,
                    "message": (
                        "You do not have permission "
                        "to view this receipt."
                    ),
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        # Receipt only available for paid rent
        if rent.status != RentPayment.Status.PAID:
            return Response(
                {
                    "success": False,
                    "message": (
                        "Receipt is only available "
                        "for paid rent."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        # Generate PDF
        pdf_buffer = generate_rent_receipt(rent)
        response = HttpResponse(
            pdf_buffer.getvalue(),
            content_type="application/pdf",
        )
        receipt_number = (
            rent.mpesa_receipt_number
            or rent.payment_reference
            or str(rent.id)
        )
        response[
            "Content-Disposition"
        ] = (
            f'attachment; '
            f'filename="HomeLink-Rent-Receipt-'
            f'{receipt_number}.pdf"'
        )
        return response

    @action(
        detail=True,
        methods=["post"],
    )
    def mark_overdue(self, request, pk=None):

        rent = self.get_object()

        if rent.status == RentPayment.Status.PAID:
            return Response(
                {
                    "success": False,
                    "message": (
                        "This rent payment is "
                        "already paid."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if rent.due_date >= date.today():
            return Response(
                {
                    "success": False,
                    "message": (
                        "This rent payment is "
                        "not overdue yet."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        rent.status = RentPayment.Status.OVERDUE

        rent.save(
            update_fields=[
                "status",
                "updated_at",
            ]
        )

        return Response(
            {
                "success": True,
                "message": "Rent marked as overdue.",
            }
        )