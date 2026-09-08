from rest_framework import serializers

from reports.models import PropertyReport


class PropertyReportSerializer(serializers.ModelSerializer):

    reporter_name = serializers.CharField(
        source="reporter.get_full_name",
        read_only=True,
    )

    property_title = serializers.CharField(
        source="property.title",
        read_only=True,
    )

    class Meta:
        model = PropertyReport
        fields = (
            "id",
            "property",
            "property_title",
            "reason",
            "description",
            "status",
            "reporter_name",
            "created_at",
        )

        read_only_fields = (
            "id",
            "status",
            "reporter_name",
            "created_at",
        )