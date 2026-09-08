from django.db.models import Q

from properties.models import Property


class RecommendationService:

    @staticmethod
    def recommend(user, limit=20):

        queryset = Property.objects.filter(
            status=Property.Status.APPROVED
        )

        if not user.is_authenticated:
            return queryset.order_by(
                "-is_featured",
                "-created_at",
            )[:limit]

        favourites = user.favourites.values_list(
            "property_id",
            flat=True,
        )

        viewed = user.recently_viewed.values_list(
            "property_id",
            flat=True,
        )

        queryset = queryset.exclude(
            owner=user
        )

        queryset = queryset.extra(
            select={
                "score": """
                CASE
                    WHEN id IN %s THEN 100
                    WHEN id IN %s THEN 50
                    ELSE 0
                END
                """
            },
            select_params=[
                tuple(favourites) or (0,),
                tuple(viewed) or (0,),
            ],
        )

        return queryset.order_by(
            "-score",
            "-is_featured",
            "-created_at",
        )[:limit]