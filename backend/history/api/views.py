from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from history.models import RecentlyViewed
from properties.models import Property

from .serializers import RecentlyViewedSerializer


class RecentlyViewedViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = RecentlyViewedSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return RecentlyViewed.objects.filter(
            user=self.request.user
        ).select_related("property")


    @action(detail=False, methods=["post"])
    def record(self, request):

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


        view, created = RecentlyViewed.objects.get_or_create(
            user=request.user,
            property=property,
        )

        if not created:
            view.save()

        history = RecentlyViewed.objects.filter(
            user=request.user
        ).order_by("-viewed_at")

        if history.count() > 20:
            history.last().delete()

        return Response(
            {
                "success": True,
                "message": "View recorded."
            }
        )