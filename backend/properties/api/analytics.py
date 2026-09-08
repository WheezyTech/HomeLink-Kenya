from django.db.models import Sum, Count

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from properties.models import Property, PropertyAnalytics


class DashboardAnalyticsAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        properties = Property.objects.filter(
            owner=request.user
        )

        analytics = PropertyAnalytics.objects.filter(
            property__owner=request.user
        )

        totals = analytics.aggregate(
            total_views=Sum("views"),
            total_favourites=Sum("favourites"),
            total_bookings=Sum("bookings"),
            total_chats=Sum("chats"),
        )

        most_popular = analytics.order_by(
            "-popularity_score"
        ).first()

        data = {
            "total_properties": properties.count(),
            "approved_properties": properties.filter(
                status=Property.Status.APPROVED
            ).count(),
            "pending_properties": properties.filter(
                status=Property.Status.PENDING
            ).count(),
            "featured_properties": properties.filter(
                is_featured=True
            ).count(),
            "total_views": totals["total_views"] or 0,
            "total_favourites": totals["total_favourites"] or 0,
            "total_bookings": totals["total_bookings"] or 0,
            "total_chats": totals["total_chats"] or 0,
            "most_popular": None,
        }

        if most_popular:

            data["most_popular"] = {
                "id": str(most_popular.property.id),
                "title": most_popular.property.title,
                "views": most_popular.views,
                "bookings": most_popular.bookings,
                "favourites": most_popular.favourites,
                "chats": most_popular.chats,
                "score": most_popular.popularity_score,
            }

        return Response(data)