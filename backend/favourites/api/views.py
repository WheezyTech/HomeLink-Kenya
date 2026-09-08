from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ai.services.profile import AIProfileService
from favourites.models import Favourite
from properties.models import Property, PropertyAnalytics

from .serializers import FavouriteSerializer


class FavouriteViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = FavouriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Favourite.objects.filter(
            user=self.request.user
        ).select_related("property")


    @action(detail=False, methods=["post"])
    def toggle(self, request):

        property_id = request.data.get("property")

        try:
            property = Property.objects.get(id=property_id)

        except Property.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "Property not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )


        favourite = Favourite.objects.filter(
            user=request.user,
            property=property,
        ).first()


        if favourite:
            favourite.delete()

            AIProfileService.rebuild(request.user)

            analytics, _ = PropertyAnalytics.objects.get_or_create(
                property=property
            )

            if analytics.favourites > 0:
                analytics.favourites -= 1

            analytics.calculate_score()
            analytics.save(update_fields=["favourites", "popularity_score"])

            return Response(
                {
                    "success": True,
                    "action": "removed",
                    "message": "Removed from favourites."
                }
            )


        Favourite.objects.create(
            user=request.user,
            property=property,
        )

        AIProfileService.rebuild(request.user)

        analytics, _ = PropertyAnalytics.objects.get_or_create(
            property=property
        )

        analytics.favourites += 1
        analytics.calculate_score()
        analytics.save(update_fields=["favourites", "popularity_score"])

        return Response(
            {
                "success": True,
                "action": "added",
                "message": "Added to favourites."
            },
            status=status.HTTP_201_CREATED,
        )