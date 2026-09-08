from rest_framework import serializers

from .models import Viewing


class ViewingSerializer(serializers.ModelSerializer):

    property_title = serializers.CharField(
        source="property.title",
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

    class Meta:
        model = Viewing
        fields = "__all__"

        read_only_fields = (
            "tenant",
            "landlord",
            "status",
            "created_at",
            "updated_at",
        )