from django.db.models import Avg

from ai.models import AIUserProfile
from favourites.models import Favourite
from bookings.models import Booking
from chat.models import Conversation


class AIProfileService:

    @staticmethod
    def rebuild(user):

        profile, _ = AIUserProfile.objects.get_or_create(
            user=user
        )

        favourites = Favourite.objects.filter(
            user=user
        ).select_related("property")

        bookings = Booking.objects.filter(
            tenant=user
        ).select_related("property")

        chats = Conversation.objects.filter(
            tenant=user
        ).select_related("property")

        if favourites.exists():

            latest = favourites.first().property

            profile.preferred_county = latest.county
            profile.preferred_estate = latest.estate
            profile.preferred_property_type = latest.property_type

            avg_price = favourites.aggregate(
                Avg("property__price")
            )["property__price__avg"]

            profile.average_budget = avg_price or 0

            avg_bedrooms = favourites.aggregate(
                Avg("property__bedrooms")
            )["property__bedrooms__avg"]

            profile.preferred_bedrooms = int(
                avg_bedrooms or 0
            )

        profile.favourite_count = favourites.count()
        profile.booking_count = bookings.count()
        profile.chat_count = chats.count()

        profile.save()

        return profile