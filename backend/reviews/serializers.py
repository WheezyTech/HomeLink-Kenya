from rest_framework import serializers

from .models import ServiceReview


class ServiceReviewSerializer(serializers.ModelSerializer):

    customer_name = serializers.SerializerMethodField()
    provider_name = serializers.CharField(
        source="provider.business_name",
        read_only=True,
    )

    class Meta:

        model = ServiceReview

        fields = [
            "id",
            "service_request",
            "customer",
            "customer_name",
            "provider",
            "provider_name",
            "rating",
            "comment",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "customer",
            "customer_name",
            "provider",
            "provider_name",
            "created_at",
            "updated_at",
        ]

    def get_customer_name(self, obj):

        if hasattr(obj.customer, "get_full_name"):
            name = obj.customer.get_full_name()

            if name:
                return name

        return obj.customer.email