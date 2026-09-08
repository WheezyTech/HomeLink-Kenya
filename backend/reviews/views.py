from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from services.models import ServiceRequest

from .models import ServiceReview
from .serializers import ServiceReviewSerializer


class ServiceReviewViewSet(viewsets.ModelViewSet):

    serializer_class = ServiceReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        queryset = ServiceReview.objects.select_related(
            "customer",
            "provider",
            "service_request",
        )

        provider_id = self.request.query_params.get(
            "provider"
        )

        if provider_id:
            queryset = queryset.filter(
                provider_id=provider_id
            )
        else:
            queryset = queryset.filter(
                customer=self.request.user
            )

        return queryset

    def create(self, request, *args, **kwargs):

        service_request_id = request.data.get(
            "service_request"
        )

        rating = request.data.get("rating")
        comment = request.data.get("comment", "")

        try:

            service_request = ServiceRequest.objects.select_related(
                "listing",
                "listing__provider",
            ).get(
                id=service_request_id
            )

        except ServiceRequest.DoesNotExist:

            return Response(
                {
                    "success": False,
                    "message": "Service request not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        # Only the customer who made the request can review it.

        if service_request.customer != request.user:

            return Response(
                {
                    "success": False,
                    "message": "You can only review your own service requests.",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        # Only completed jobs can be reviewed.

        if service_request.status != ServiceRequest.Status.COMPLETED:

            return Response(
                {
                    "success": False,
                    "message": "You can only review completed services.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # One review per completed request.

        if ServiceReview.objects.filter(
            service_request=service_request
        ).exists():

            return Response(
                {
                    "success": False,
                    "message": "You have already reviewed this service.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = self.get_serializer(
            data={
                "service_request": service_request.id,
                "rating": rating,
                "comment": comment,
            }
        )

        serializer.is_valid(
            raise_exception=True
        )

        review = serializer.save(
            customer=request.user,
            provider=service_request.listing.provider,
        )

        self.update_provider_rating(
            review.provider
        )

        return Response(
            {
                "success": True,
                "message": "Review submitted successfully.",
                "review": self.get_serializer(
                    review
                ).data,
            },
            status=status.HTTP_201_CREATED,
        )

    def update_provider_rating(self, provider):

        reviews = ServiceReview.objects.filter(
            provider=provider
        )

        if reviews.exists():

            total = sum(
                review.rating
                for review in reviews
            )

            provider.rating = round(
                total / reviews.count(),
                2,
            )

        else:

            provider.rating = 0

        provider.save(
            update_fields=["rating"]
        )