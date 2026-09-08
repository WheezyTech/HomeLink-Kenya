import json
from datetime import datetime
from decimal import Decimal

from django.db import transaction
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from payments.models import Payment
from payments.services import PaymentService
from subscriptions.services import SubscriptionService
from notifications.models import Notification
from notifications.services import NotificationService


@csrf_exempt
def mpesa_callback(request):
    """
    Handles Safaricom M-Pesa STK Push callbacks
    for both subscription and rent payments.
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
            {},
        ).get(
            "stkCallback",
            {},
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
            "",
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

        # ==================================================
        # CHECK FOR RENT PAYMENT FIRST
        # ==================================================

        from rent_payments.models import RentPayment

        try:

            rent_payment = (
                RentPayment.objects.get(
                    checkout_request_id=(
                        checkout_request_id
                    )
                )
            )

        except RentPayment.DoesNotExist:

            rent_payment = None

        # ==================================================
        # RENT PAYMENT CALLBACK
        # ==================================================

        if rent_payment:

            # Prevent duplicate processing
            if (
                rent_payment.status
                == RentPayment.Status.PAID
            ):
                return JsonResponse(
                    {
                        "ResultCode": 0,
                        "ResultDesc": (
                            "Rent callback "
                            "already processed."
                        ),
                    }
                )

            # ------------------------------
            # PAYMENT FAILED
            # ------------------------------

            if result_code != "0":

                rent_payment.status = (
                    RentPayment.Status.FAILED
                )

                rent_payment.notes = (
                    result_desc
                )

                rent_payment.save(
                    update_fields=[
                        "status",
                        "notes",
                        "updated_at",
                    ]
                )

                NotificationService.create(
                    user=rent_payment.tenant,
                    title="Rent Payment Failed",
                    message=(
                        f"Your rent payment for "
                        f"'{rent_payment.lease.property.title}' "
                        f"failed. "
                        f"{result_desc}"
                    ),
                    notification_type=(
                        Notification.NotificationType.PAYMENT
                    ),
                )

                return JsonResponse(
                    {
                        "ResultCode": 0,
                        "ResultDesc": (
                            "Rent payment "
                            "failure recorded."
                        ),
                    }
                )

            # ------------------------------
            # CALLBACK METADATA
            # ------------------------------

            callback_metadata = (
                stk_callback.get(
                    "CallbackMetadata",
                    {},
                )
            )

            callback_items = (
                callback_metadata.get(
                    "Item",
                    [],
                )
            )

            values = {}

            for item in callback_items:

                values[
                    item.get("Name")
                ] = item.get("Value")

            receipt = values.get(
                "MpesaReceiptNumber"
            )

            transaction_date = None

            if values.get("TransactionDate"):

                transaction_date = (
                    datetime.strptime(
                        str(
                            values[
                                "TransactionDate"
                            ]
                        ),
                        "%Y%m%d%H%M%S",
                    )
                )

            amount = values.get(
                "Amount"
            )

            if amount is None:

                return JsonResponse(
                    {
                        "ResultCode": 1,
                        "ResultDesc": (
                            "Payment amount "
                            "missing."
                        ),
                    },
                    status=400,
                )

            amount = Decimal(str(amount))

            # ==================================================
            # UPDATE RENT PAYMENT
            # ==================================================

            with transaction.atomic():

                rent_payment.amount_paid += amount

                rent_payment.mpesa_receipt_number = (
                    receipt or ""
                )

                rent_payment.transaction_date = (
                    transaction_date
                )

                rent_payment.result_code = (
                    result_code
                )

                rent_payment.result_description = (
                    result_desc
                )

                rent_payment.payment_reference = (
                    receipt or rent_payment.id
                )

                # Determine payment status
                if (
                    rent_payment.amount_paid
                    >= rent_payment.amount_due
                ):

                    rent_payment.amount_paid = (
                        rent_payment.amount_due
                    )

                    rent_payment.status = (
                        RentPayment.Status.PAID
                    )

                    notification_title = (
                        "Rent Payment Successful"
                    )

                    notification_message = (
                        f"Your rent payment for "
                        f"'{rent_payment.lease.property.title}' "
                        f"has been completed successfully."
                    )

                else:

                    rent_payment.status = (
                        RentPayment.Status.PARTIAL
                    )

                    notification_title = (
                        "Partial Rent Payment"
                    )

                    remaining = (
                        rent_payment.amount_due
                        - rent_payment.amount_paid
                    )

                    notification_message = (
                        f"Your partial rent payment "
                        f"for "
                        f"'{rent_payment.lease.property.title}' "
                        f"was received. "
                        f"Remaining balance: "
                        f"KSh {remaining}."
                    )

                rent_payment.save()

                # Notify tenant
                NotificationService.create(
                    user=rent_payment.tenant,
                    title=notification_title,
                    message=notification_message,
                    notification_type=(
                        Notification.NotificationType.PAYMENT
                    ),
                )

                # Notify landlord
                NotificationService.create(
                    user=rent_payment.landlord,
                    title="Rent Payment Received",
                    message=(
                        f"Rent payment received "
                        f"for "
                        f"'{rent_payment.lease.property.title}'. "
                        f"M-Pesa receipt: "
                        f"{receipt or 'N/A'}."
                    ),
                    notification_type=(
                        Notification.NotificationType.PAYMENT
                    ),
                )

            return JsonResponse(
                {
                    "ResultCode": 0,
                    "ResultDesc": (
                        "Rent payment "
                        "processed successfully."
                    ),
                }
            )

        # ==================================================
        # EXISTING SUBSCRIPTION PAYMENT
        # ==================================================

        try:

            payment = Payment.objects.get(
                checkout_request_id=(
                    checkout_request_id
                )
            )

        except Payment.DoesNotExist:

            return JsonResponse(
                {
                    "ResultCode": 1,
                    "ResultDesc": (
                        "Payment not found."
                    ),
                },
                status=404,
            )

        # Prevent duplicate processing
        if (
            payment.status
            == Payment.Status.SUCCESS
        ):
            return JsonResponse(
                {
                    "ResultCode": 0,
                    "ResultDesc": (
                        "Callback already "
                        "processed."
                    ),
                }
            )

        # Payment failed
        if result_code != "0":

            PaymentService.mark_failed(
                payment=payment,
                result_code=result_code,
                result_description=result_desc,
                callback_payload=payload,
            )

            return JsonResponse(
                {
                    "ResultCode": 0,
                    "ResultDesc": (
                        "Failure recorded."
                    ),
                }
            )

        callback_metadata = (
            stk_callback.get(
                "CallbackMetadata",
                {},
            )
        )

        callback_items = (
            callback_metadata.get(
                "Item",
                [],
            )
        )

        values = {}

        for item in callback_items:

            values[
                item.get("Name")
            ] = item.get("Value")

        receipt = values.get(
            "MpesaReceiptNumber"
        )

        transaction_date = None

        if values.get("TransactionDate"):

            transaction_date = (
                datetime.strptime(
                    str(
                        values[
                            "TransactionDate"
                        ]
                    ),
                    "%Y%m%d%H%M%S",
                )
            )

        # Existing subscription processing
        with transaction.atomic():

            PaymentService.mark_success(
                payment=payment,
                receipt=receipt,
                transaction_date=transaction_date,
                result_code=result_code,
                result_description=result_desc,
                callback_payload=payload,
            )

            subscription = (
                SubscriptionService.activate(
                    user=payment.user,
                    plan=payment.subscription,
                    payment=payment,
                )
            )

            NotificationService.create(
                user=payment.user,
                title="Subscription Activated",
                message=(
                    f"Your "
                    f"{subscription.plan.name} "
                    f"subscription has been "
                    f"activated successfully."
                ),
                notification_type=(
                    Notification.NotificationType.PAYMENT
                ),
            )

        return JsonResponse(
            {
                "ResultCode": 0,
                "ResultDesc": "Accepted",
            }
        )

    except json.JSONDecodeError:

        return JsonResponse(
            {
                "ResultCode": 1,
                "ResultDesc": (
                    "Invalid JSON payload."
                ),
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