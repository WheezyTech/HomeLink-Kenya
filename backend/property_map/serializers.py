from rest_framework import serializers

from .models import NearbyPlace


class NearbyPlaceSerializer(
    serializers.ModelSerializer
):

    place_type_display = serializers.CharField(
        source="get_place_type_display",
        read_only=True,
    )

    class Meta:
        model = NearbyPlace

        fields = (
            "id",
            "name",
            "place_type",
            "place_type_display",
            "address",
            "latitude",
            "longitude",
            "phone",
            "website",
            "rating",
            "distance_km",
            "is_verified",
            "source",
        )

        read_only_fields = fields