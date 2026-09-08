from datetime import datetime

from decouple import config
from django.conf import settings

try:
    from mpesa.api.mpesa_express import MpesaExpress
except ImportError:  # pragma: no cover - optional dependency in local/dev setups
    MpesaExpress = None


class MpesaService:

    @staticmethod
    def stk_push(phone_number, amount, account_reference, transaction_desc):
        if MpesaExpress is None:
            raise ImportError("The mpesa SDK is not installed.")

        stk = MpesaExpress()

        response = stk.stk_push(
            phone_number=phone_number,
            amount=int(amount),
            account_reference=account_reference,
            transaction_desc=transaction_desc,
            callback_url=settings.MPESA_CALLBACK_URL,
        )

        return response