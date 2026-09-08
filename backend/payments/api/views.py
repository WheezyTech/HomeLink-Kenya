from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from payments.models import Payment
from payments.services import MpesaService

from .serializers import PaymentSerializer
from rest_framework.decorators import action

class PaymentViewSet(viewsets.ModelViewSet):

    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(
            user=self.request.user
        ).select_related(
            "subscription"
        )

    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        plan = serializer.validated_data["subscription"]

        payment = Payment.objects.create(
            user=request.user,
            subscription=plan,
            amount=plan.price,
            phone_number=serializer.validated_data["phone_number"],
        )

        try:

            response = MpesaService.stk_push(
                phone_number=payment.phone_number,
                amount=payment.amount,
                account_reference=str(payment.id),
                transaction_desc=plan.name,
            )

            payment.merchant_request_id = response.get(
                "MerchantRequestID",
                ""
            )

            payment.checkout_request_id = response.get(
                "CheckoutRequestID",
                ""
            )

            payment.save(
                update_fields=[
                    "merchant_request_id",
                    "checkout_request_id",
                ]
            )

            return Response(
                {
                    "success": True,
                    "message": "STK Push sent successfully.",
                    "payment_id": payment.id,
                    "checkout_request_id": payment.checkout_request_id,
                },
                status=status.HTTP_201_CREATED,
            )

        except Exception as e:

            payment.status = Payment.Status.FAILED
            payment.result_description = str(e)
            payment.save()

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
    )
    def receipt(self, request, pk=None):

        payment = self.get_object()

        return Response(
            {
                "payment_id": payment.id,
                "receipt_number": payment.mpesa_receipt_number,
                "amount": payment.amount,
                "plan": payment.subscription.name,
                "status": payment.status,
                "paid_on": payment.transaction_date,
            }
        )