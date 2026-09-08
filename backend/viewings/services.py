from notifications.models import Notification


class ViewingService:

    @staticmethod
    def notify_landlord(viewing):

        Notification.objects.create(
            user=viewing.landlord,
            title="New Viewing Request",
            message=f"{viewing.tenant.first_name} requested a viewing for {viewing.property.title}.",
            notification_type="BOOKING",
        )

    @staticmethod
    def notify_tenant(viewing, message):

        Notification.objects.create(
            user=viewing.tenant,
            title="Viewing Update",
            message=message,
            notification_type="BOOKING",
        )