from rest_framework import serializers

from payments.models import Payment


class PaymentSerializer(serializers.ModelSerializer):

    plan_name = serializers.CharField(
        source="subscription.name",
        read_only=True,
    )

    class Meta:
        model = Payment
        fields = (
            "id",
            "subscription",
            "plan_name",
            "phone_number",
            "amount",
            "status",
            "mpesa_receipt_number",
            "transaction_date",
            "created_at",
        )

        read_only_fields = (
            "id",
            "plan_name",
            "amount",
            "status",
            "mpesa_receipt_number",
            "transaction_date",
            "created_at",
        )

    def validate_subscription(self, value):
        if not value.is_active:
            raise serializers.ValidationError(
                "Subscription plan is not available."
            )
        return value