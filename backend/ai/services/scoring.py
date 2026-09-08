from favourites.models import Favourite
from bookings.models import Booking
from chat.models import Conversation


class RecommendationScoreService:

    @staticmethod
    def score(user, property):

        score = 0

        # Featured properties
        if property.is_featured:
            score += 30

        # Verified properties
        if property.is_verified:
            score += 20

        # Popularity
        if hasattr(property, "analytics"):
            score += property.analytics.popularity_score

        # Favourite history
        favourite = Favourite.objects.filter(
            user=user
        ).select_related("property")

        for item in favourite:

            if item.property.county == property.county:
                score += 40

            if item.property.property_type == property.property_type:
                score += 35

            if item.property.category == property.category:
                score += 25

            if abs(item.property.price - property.price) <= 5000:
                score += 20

        # Booking history
        bookings = Booking.objects.filter(
            tenant=user
        ).select_related("property")

        for booking in bookings:

            if booking.property.county == property.county:
                score += 25

            if booking.property.property_type == property.property_type:
                score += 20

        # Chat history
        chats = Conversation.objects.filter(
            tenant=user
        ).select_related("property")

        for chat in chats:

            if chat.property.county == property.county:
                score += 10

        return score