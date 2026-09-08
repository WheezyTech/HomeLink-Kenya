import json
from datetime import datetime
from decimal import Decimal

from django.db import transaction
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt

from rent_payments.models import RentPayment
from notifications.models import Notification
from notifications.services import NotificationService


@csrf_exempt
def rent_mpesa_callback(request):
    """
    Handles M-Pesa STK Push callbacks for rent payments.
    """

    if request.method != "POST":
        return JsonResponse(
            {
                "ResultCode": 1,
                "ResultDesc": "Only POST requests are allowed.",
            },
            status=405,
        )

    try:
        payload = json.loads(request.body)

        stk_callback = payload.get(
            "Body",
            {}
        ).get(
            "stkCallback",
            {}
        )

        checkout_request_id = stk_callback.get(
            "CheckoutRequestID"
        )

        result_code = str(
            stk_callback.get(
                "ResultCode"
            )
        )

        result_desc = stk_callback.get(
            "ResultDesc",
            ""
        )

        if not checkout_request_id:
            return JsonResponse(
                {
                    "ResultCode": 1,
                    "ResultDesc": (
                        "CheckoutRequestID missing."
                    ),
                },
                status=400,
            )

        try:
            rent = RentPayment.objects.get(
                checkout_request_id=checkout_request_id
            )

        except RentPayment.DoesNotExist:
            return JsonResponse(
                {
                    "ResultCode": 1,
                    "ResultDesc": (
                        "Rent payment not found."
                    ),
                },
                status=404,
            )

        # Prevent duplicate callback processing
        if rent.status == RentPayment.Status.PAID:
            return JsonResponse(
                {
                    "ResultCode": 0,
                    "ResultDesc": (
                        "Callback already processed."
                    ),
                }
            )

        # Payment failed or was cancelled
        if result_code != "0":

            rent.status = RentPayment.Status.FAILED
            rent.notes = result_desc

            rent.save(
                update_fields=[
                    "status",
                    "notes",
                    "updated_at",
                ]
            )

            return JsonResponse(
                {
                    "ResultCode": 0,
                    "ResultDesc": (
                        "Rent payment failure recorded."
                    ),
                }
            )

        # Get callback metadata
        callback_metadata = stk_callback.get(
            "CallbackMetadata",
            {}
        )

        callback_items = callback_metadata.get(
            "Item",
            []
        )

        values = {}

        for item in callback_items:
            name = item.get("Name")

            if name:
                values[name] = item.get("Value")

        receipt = values.get(
            "MpesaReceiptNumber"
        )

        amount = values.get(
            "Amount"
        )

        transaction_date = values.get(
            "TransactionDate"
        )

        paid_at = None

        if transaction_date:
            paid_at = datetime.strptime(
                str(transaction_date),
                "%Y%m%d%H%M%S"
            )

        # Get the payment amount
        amount = values.get("Amount")
        if not amount:
            return JsonResponse(
                {
                    "ResultCode": 1,
                    "ResultDesc": "Payment amount missing.",
                },
                status=400,
            )
        amount = Decimal(str(amount))

        # Generate HomeLink receipt number
        receipt_number = (
            f"HL-"
            f"{timezone.localdate().strftime('%Y%m%d')}-"
            f"{str(rent.id).replace('-', '')[:8].upper()}"
        )

        with transaction.atomic():
            rent = RentPayment.objects.select_for_update().get(
                pk=rent.pk
            )
            # Add the new payment
            rent.amount_paid = (
                rent.amount_paid + amount
            )
            # Prevent amount paid from exceeding amount due
            if rent.amount_paid >= rent.amount_due:
                rent.amount_paid = rent.amount_due
                rent.status = RentPayment.Status.PAID
            else:
                rent.status = RentPayment.Status.PARTIAL
            rent.paid_at = paid_at
            rent.mpesa_receipt_number = (
                receipt or ""
            )
            rent.receipt_number = receipt_number
            rent.notes = result_desc
            rent.save(
                update_fields=[
                    "amount_paid",
                    "status",
                    "paid_at",
                    "mpesa_receipt_number",
                    "receipt_number",
                    "notes",
                    "updated_at",
                ]
            )
            # ---------------------------------
            # Notifications (use service)
            # ---------------------------------
            NotificationService.create(
                user=rent.tenant,
                title="Rent Payment Successful",
                message=(
                    f"Your rent payment of "
                    f"KSh {amount:,.2f} for "
                    f"'{rent.lease.property.title}' "
                    f"has been received successfully. "
                    f"M-Pesa Receipt: "
                    f"{rent.mpesa_receipt_number or 'N/A'}."
                ),
                notification_type=(
                    Notification.NotificationType.PAYMENT
                ),
            )
            NotificationService.create(
                user=rent.landlord,
                title="Rent Payment Received",
                message=(
                    f"You have received a rent payment of "
                    f"KSh {amount:,.2f} from "
                    f"{rent.tenant.get_full_name() or rent.tenant.email} "
                    f"for '{rent.lease.property.title}'. "
                    f"M-Pesa Receipt: "
                    f"{rent.mpesa_receipt_number or 'N/A'}."
                ),
                notification_type=(
                    Notification.NotificationType.PAYMENT
                ),
            )

        return JsonResponse(
            {
                "ResultCode": 0,
                "ResultDesc": (
                    "Rent payment processed successfully."
                ),
            }
        )

    except json.JSONDecodeError:

        return JsonResponse(
            {
                "ResultCode": 1,
                "ResultDesc": "Invalid JSON payload.",
            },
            status=400,
        )

    except Exception as e:

        return JsonResponse(
            {
                "ResultCode": 1,
                "ResultDesc": str(e),
            },
            status=500,
        )