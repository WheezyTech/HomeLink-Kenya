from notifications.models import Notification


class NotificationService:

    @staticmethod
    def create(user, title, message, notification_type):

        return Notification.objects.create(
            user=user,
            title=title,
            message=message,
            notification_type=notification_type,
        )