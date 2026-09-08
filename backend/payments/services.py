from django.utils import timezone

from payments.models import Payment


class PaymentService:

    @staticmethod
    def mark_success(
        payment,
        receipt,
        transaction_date,
        result_code,
        result_description,
        callback_payload,
    ):

        payment.status = Payment.Status.SUCCESS
        payment.mpesa_receipt_number = receipt
        payment.transaction_date = transaction_date
        payment.result_code = result_code
        payment.result_description = result_description
        payment.callback_payload = callback_payload

        payment.save()

        return payment

    @staticmethod
    def mark_failed(
        payment,
        result_code,
        result_description,
        callback_payload,
    ):

        payment.status = Payment.Status.FAILED
        payment.result_code = result_code
        payment.result_description = result_description
        payment.callback_payload = callback_payload

        payment.save()

        return payment