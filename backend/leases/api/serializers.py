from rest_framework import serializers

from leases.models import Lease


class LeaseSerializer(serializers.ModelSerializer):

    class Meta:
        model = Lease
        fields = "__all__"

        read_only_fields = (
            "id",
            "property",
            "landlord",
            "tenant",
            "status",
            "lease_document",
            "created_at",
            "updated_at",
        )

    def validate(self, attrs):

        start_date = attrs.get(
            "start_date",
            getattr(
                self.instance,
                "start_date",
                None,
            ),
        )

        end_date = attrs.get(
            "end_date",
            getattr(
                self.instance,
                "end_date",
                None,
            ),
        )

        monthly_rent = attrs.get(
            "monthly_rent",
            getattr(
                self.instance,
                "monthly_rent",
                None,
            ),
        )

        security_deposit = attrs.get(
            "security_deposit",
            getattr(
                self.instance,
                "security_deposit",
                None,
            ),
        )

        if start_date and end_date:
            if end_date <= start_date:
                raise serializers.ValidationError(
                    {
                        "end_date": (
                            "End date must be after "
                            "the start date."
                        )
                    }
                )

        if monthly_rent is not None:
            if monthly_rent <= 0:
                raise serializers.ValidationError(
                    {
                        "monthly_rent": (
                            "Monthly rent must be "
                            "greater than zero."
                        )
                    }
                )

        if security_deposit is not None:
            if security_deposit < 0:
                raise serializers.ValidationError(
                    {
                        "security_deposit": (
                            "Security deposit cannot "
                            "be negative."
                        )
                    }
                )

        return attrs