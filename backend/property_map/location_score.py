from decimal import Decimal

from .models import NearbyPlace


class PropertyLocationScoreService:

    CATEGORY_WEIGHTS = {
        "SCHOOL": 2.0,
        "HOSPITAL": 2.0,
        "SUPERMARKET": 1.5,
        "POLICE": 1.5,
        "BUS_STAGE": 1.0,
        "CHURCH": 0.5,
        "MOSQUE": 0.5,
    }

    CATEGORY_LABELS = {
        "SCHOOL": "Schools",
        "HOSPITAL": "Hospitals",
        "SUPERMARKET": "Supermarkets",
        "POLICE": "Police Stations",
        "BUS_STAGE": "Bus Stages",
        "CHURCH": "Churches",
        "MOSQUE": "Mosques",
    }

    @classmethod
    def calculate(cls, latitude, longitude):
        places = NearbyPlace.objects.filter(
            latitude__isnull=False,
            longitude__isnull=False,
            distance_km__isnull=False,
        )

        places = cls._filter_nearby(
            places,
            latitude,
            longitude,
        )

        category_data = {}

        total_score = Decimal("0")
        total_weight = Decimal("0")

        for category, weight in (
            cls.CATEGORY_WEIGHTS.items()
        ):

            category_places = [
                place
                for place in places
                if place.place_type == category
            ]

            count = len(category_places)

            nearest_distance = None

            if category_places:
                nearest_distance = min(
                    place.distance_km
                    for place in category_places
                    if place.distance_km is not None
                )

            category_score = (
                cls._category_score(
                    count,
                    nearest_distance,
                )
            )

            category_weight = Decimal(
                str(weight)
            )

            total_score += (
                category_score
                * category_weight
            )

            total_weight += category_weight

            category_data[category] = {
                "label": cls.CATEGORY_LABELS[
                    category
                ],
                "count": count,
                "nearest_distance_km": (
                    float(nearest_distance)
                    if nearest_distance is not None
                    else None
                ),
                "score": float(
                    category_score
                ),
            }

        if total_weight > 0:
            overall_score = (
                total_score / total_weight
            )
        else:
            overall_score = Decimal("0")

        return {
            "score": round(
                float(overall_score),
                1,
            ),
            "categories": category_data,
        }

    @classmethod
    def refresh_from_google(
        cls,
        latitude,
        longitude,
        radius=5000,
    ):
        from datetime import timedelta

        from django.utils import timezone

        from .models import NearbyPlace
        from .services import GooglePlacesService

        cutoff = timezone.now() - timedelta(
            hours=24
        )

        recent_places = NearbyPlace.objects.filter(
            created_at__gte=cutoff,
            latitude__isnull=False,
            longitude__isnull=False,
        )

        if recent_places.exists():
            return cls.calculate(
                latitude,
                longitude,
            )

        GooglePlacesService.sync_nearby_places(
            latitude=latitude,
            longitude=longitude,
            radius=radius,
        )

        return cls.calculate(
            latitude,
            longitude,
        )

    @staticmethod
    def _category_score(
        count,
        nearest_distance,
    ):
        if not count:
            return Decimal("0")

        if nearest_distance is None:
            return Decimal("0")

        distance = float(
            nearest_distance
        )

        if distance <= 0.5:
            distance_score = 10
        elif distance <= 1:
            distance_score = 9
        elif distance <= 2:
            distance_score = 8
        elif distance <= 3:
            distance_score = 6
        elif distance <= 5:
            distance_score = 4
        else:
            distance_score = 2

        availability_bonus = min(
            count,
            3,
        ) * 0.5

        return Decimal(
            str(
                min(
                    10,
                    distance_score
                    + availability_bonus,
                )
            )
        )

    @staticmethod
    def _filter_nearby(
        places,
        latitude,
        longitude,
    ):
        """
        The nearby endpoint already calculates
        distance from the property.

        Keep places within 10 km.
        """

        return [
            place
            for place in places
            if place.distance_km is not None
            and float(place.distance_km) <= 10
        ]