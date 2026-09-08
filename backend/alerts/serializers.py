from rest_framework import serializers

from .models import SavedSearch, PropertyAlert


class SavedSearchSerializer(serializers.ModelSerializer):

    class Meta:
        model = SavedSearch

        fields = (
            "id",
            "name",
            "location",
            "property_type",
            "min_price",
            "max_price",
            "bedrooms",
            "bathrooms",
            "is_active",
            "notify_email",
            "notify_push",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
        )

    def validate(self, attrs):

        min_price = attrs.get("min_price")
        max_price = attrs.get("max_price")

        if (
            min_price is not None
            and max_price is not None
            and min_price > max_price
        ):
            raise serializers.ValidationError(
                {
                    "max_price":
                    "Maximum price cannot be lower than minimum price."
                }
            )

        return attrs


class PropertyAlertSerializer(
    serializers.ModelSerializer
):

    property_title = serializers.CharField(
        source="property.title",
        read_only=True,
    )

    class Meta:
        model = PropertyAlert

        fields = (
            "id",
            "saved_search",
            "property",
            "property_title",
            "alert_type",
            "title",
            "message",
            "is_read",
            "created_at",
        )

        read_only_fields = (
            "id",
            "saved_search",
            "property",
            "property_title",
            "alert_type",
            "title",
            "message",
            "created_at",
        )