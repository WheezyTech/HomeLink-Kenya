from rest_framework import serializers

from applications.models import RentalApplication



class RentalApplicationSerializer(serializers.ModelSerializer):

    property_title = serializers.CharField(
        source="property.title",
        read_only=True,
    )

    tenant_name = serializers.CharField(
        source="tenant.get_full_name",
        read_only=True,
    )

    class Meta:
        model = RentalApplication

        fields = "__all__"

        read_only_fields = (
            "tenant",
            "landlord",
            "status",
        )