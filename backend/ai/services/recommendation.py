from django.db.models import Q

from properties.models import Property


class AIRecommendationService:

    @staticmethod
    def search_properties(
        location=None,
        min_price=None,
        max_price=None,
        bedrooms=None,
        property_type=None,
        purpose=None,
        is_verified=None,
        is_featured=None,
    ):

        queryset = Property.objects.filter(
            status=Property.Status.APPROVED
        ).select_related(
            "owner"
        ).prefetch_related(
            "images"
        )

        if location:
            queryset = queryset.filter(
                Q(county__icontains=location)
                | Q(estate__icontains=location)
                | Q(title__icontains=location)
                | Q(description__icontains=location)
            )

        if min_price is not None:
            queryset = queryset.filter(
                price__gte=min_price
            )

        if max_price is not None:
            queryset = queryset.filter(
                price__lte=max_price
            )

        if bedrooms is not None:
            queryset = queryset.filter(
                bedrooms=bedrooms
            )

        if property_type:
            queryset = queryset.filter(
                property_type__icontains=property_type
            )

        if purpose:
            queryset = queryset.filter(
                purpose__icontains=purpose
            )

        if is_verified is not None:
            queryset = queryset.filter(
                is_verified=is_verified
            )

        if is_featured is not None:
            queryset = queryset.filter(
                is_featured=is_featured
            )

        return queryset.order_by(
            "-is_featured",
            "-created_at"
        )[:20]


# Backwards-compatible alias used by views
RecommendationService = AIRecommendationService