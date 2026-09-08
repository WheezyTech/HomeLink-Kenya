from properties.models import PropertyAnalytics


class AnalyticsService:

    @staticmethod
    def add_view(property):

        analytics, _ = PropertyAnalytics.objects.get_or_create(
            property=property
        )

        analytics.views += 1

        analytics.calculate_score()

        analytics.save(update_fields=["views", "popularity_score"])

    @staticmethod
    def add_favourite(property):

        analytics, _ = PropertyAnalytics.objects.get_or_create(
            property=property
        )

        analytics.favourites += 1

        analytics.calculate_score()

        analytics.save(update_fields=["favourites", "popularity_score"])

    @staticmethod
    def add_booking(property):

        analytics, _ = PropertyAnalytics.objects.get_or_create(
            property=property
        )

        analytics.bookings += 1

        analytics.calculate_score()

        analytics.save(update_fields=["bookings", "popularity_score"])

    @staticmethod
    def add_chat(property):

        analytics, _ = PropertyAnalytics.objects.get_or_create(
            property=property
        )

        analytics.chats += 1

        analytics.calculate_score()

        analytics.save(update_fields=["chats", "popularity_score"])