from reports.models import PropertyReport


class ReportService:

    REPORT_WARNING_THRESHOLD = 3
    REPORT_HIDE_THRESHOLD = 5
    REPORT_SUSPEND_THRESHOLD = 10

    @classmethod
    def evaluate_property(cls, property):

        pending_reports = PropertyReport.objects.filter(
            property=property,
            status=PropertyReport.Status.PENDING,
        ).count()

        # Remove verification after repeated complaints
        if pending_reports >= cls.REPORT_WARNING_THRESHOLD:
            property.is_verified = False

        # Hide listing until admin reviews it
        if pending_reports >= cls.REPORT_HIDE_THRESHOLD:
            property.status = property.Status.PENDING

        # Suspend listing completely
        if pending_reports >= cls.REPORT_SUSPEND_THRESHOLD:
            property.status = property.Status.REJECTED

        property.save(
            update_fields=[
                "status",
                "is_verified",
            ]
        )