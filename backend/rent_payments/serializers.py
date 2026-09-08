from rest_framework import serializers

from rent_payments.models import RentPayment


class RentPaymentSerializer(serializers.ModelSerializer):

    property_title = serializers.CharField(
        source="lease.property.title",
        read_only=True,
    )

    tenant_name = serializers.CharField(
        source="tenant.get_full_name",
        read_only=True,
    )

    landlord_name = serializers.CharField(
        source="landlord.get_full_name",
        read_only=True,
    )

    remaining_balance = serializers.SerializerMethodField()

    class Meta:
        model = RentPayment

        fields = (
            "id",
            "lease",
            "property_title",
            "tenant",
            "tenant_name",
            "landlord",
            "landlord_name",
            "amount_due",
            "amount_paid",
            "remaining_balance",
            "due_date",
            "paid_at",
            "status",
            "mpesa_receipt_number",
            "checkout_request_id",
            "merchant_request_id",
            "phone_number",
            "payment_reference",
            "receipt_number",
            "notes",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "property_title",
            "tenant",
            "tenant_name",
            "landlord",
            "landlord_name",
            "amount_paid",
            "remaining_balance",
            "paid_at",
            "status",
            "mpesa_receipt_number",
            "checkout_request_id",
            "merchant_request_id",
            "payment_reference",
            "receipt_number",
            "created_at",
            "updated_at",
        )

    def get_remaining_balance(self, obj):

        balance = (
            obj.amount_due - obj.amount_paid
        )

        return max(balance, 0)