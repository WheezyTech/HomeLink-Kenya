class ReceiptService:

    @staticmethod
    def generate(payment):

        return {
            "receipt": payment.mpesa_receipt_number,
            "amount": payment.amount,
            "plan": payment.subscription.name,
            "date": payment.transaction_date,
        }