from datetime import date

from rest_framework import serializers

from bookings.models import Booking


class BookingSerializer(serializers.ModelSerializer):

    property_title = serializers.CharField(
        source="property.title",
        read_only=True,
    )

    tenant_name = serializers.CharField(
        source="tenant.get_full_name",
        read_only=True,
    )

    tenant_email = serializers.EmailField(
        source="tenant.email",
        read_only=True,
    )

    tenant_phone = serializers.CharField(
        source="tenant.phone",
        read_only=True,
    )

    owner_name = serializers.CharField(
        source="landlord.get_full_name",
        read_only=True,
    )

    owner_email = serializers.EmailField(
        source="landlord.email",
        read_only=True,
    )

    class Meta:

        model = Booking

        fields = (
            "id",

            "property",
            "property_title",

            "tenant",
            "tenant_name",
            "tenant_email",
            "tenant_phone",

            "landlord",
            "owner_name",
            "owner_email",

            "viewing_date",
            "viewing_time",

            "message",
            "meeting_type",

            "owner_notes",
            "cancellation_reason",

            "checked_in",
            "completed_by",
            "reminder_sent",

            "status",

            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",

            "tenant",
            "tenant_name",
            "tenant_email",
            "tenant_phone",

            "landlord",
            "owner_name",
            "owner_email",

            "status",

            "completed_by",
            "reminder_sent",

            "created_at",
            "updated_at",
        )

    def validate_viewing_date(self, value):

        if value < date.today():

            raise serializers.ValidationError(
                "Viewing date cannot be in the past."
            )

        return value