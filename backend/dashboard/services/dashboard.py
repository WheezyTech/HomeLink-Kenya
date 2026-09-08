from django.db.models import Sum

from bookings.models import Booking
from chat.models import Message
from favourites.models import Favourite
from properties.models import Property

from subscriptions.services import SubscriptionService


class DashboardService:

    @staticmethod
    def get_dashboard(user):

        properties = Property.objects.filter(
            owner=user
        )

        subscription = SubscriptionService.get_active_subscription(
            user
        )

        analytics = properties.aggregate(
            views=Sum("analytics__views"),
            favourites=Sum("analytics__favourites"),
            bookings=Sum("analytics__bookings"),
            chats=Sum("analytics__chats"),
        )

        return {
            "total_properties": properties.count(),

            "approved_properties": properties.filter(
                status=Property.Status.APPROVED
            ).count(),

            "pending_properties": properties.filter(
                status=Property.Status.PENDING
            ).count(),

            "rented_properties": properties.filter(
                status=Property.Status.RENTED
            ).count(),

            "featured_properties": properties.filter(
                is_featured=True
            ).count(),

            "total_views": analytics["views"] or 0,

            "total_favourites": analytics["favourites"] or 0,

            "total_bookings": analytics["bookings"] or 0,

            "total_chats": analytics["chats"] or 0,

            "active_subscription": (
                subscription.plan.name
                if subscription
                else "None"
            ),

            "subscription_expiry": (
                subscription.end_date
                if subscription
                else None
            ),

            "remaining_property_slots":
                SubscriptionService.remaining_property_slots(
                    user
                ),
        }