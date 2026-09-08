from rest_framework import viewsets
from rest_framework.decorators import (
    api_view,
    permission_classes,
)
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .location_score import (
    PropertyLocationScoreService,
)
from .models import NearbyPlace
from .serializers import NearbyPlaceSerializer
from .services import GooglePlacesService, GoogleDirectionsService


class NearbyPlaceViewSet(
    viewsets.ReadOnlyModelViewSet
):

    serializer_class = NearbyPlaceSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):

        queryset = NearbyPlace.objects.all()

        place_type = self.request.query_params.get(
            "place_type"
        )

        if place_type:
            queryset = queryset.filter(
                place_type=place_type.upper()
            )

        return queryset


@api_view(["GET"])
@permission_classes([AllowAny])
def nearby_places(request):

    latitude = request.query_params.get(
        "latitude"
    )

    longitude = request.query_params.get(
        "longitude"
    )

    category = request.query_params.get(
        "category",
        "school",
    )

    radius = request.query_params.get(
        "radius",
        "5000",
    )

    if not latitude or not longitude:

        return Response(
            {
                "success": False,
                "message": (
                    "latitude and longitude "
                    "are required."
                ),
            },
            status=400,
        )

    try:
        latitude = float(latitude)
        longitude = float(longitude)
        radius = int(radius)

    except ValueError:

        return Response(
            {
                "success": False,
                "message": (
                    "Invalid latitude, longitude "
                    "or radius."
                ),
            },
            status=400,
        )

    if not -90 <= latitude <= 90:

        return Response(
            {
                "success": False,
                "message": "Invalid latitude.",
            },
            status=400,
        )

    if not -180 <= longitude <= 180:

        return Response(
            {
                "success": False,
                "message": "Invalid longitude.",
            },
            status=400,
        )

    if radius < 100 or radius > 50000:

        return Response(
            {
                "success": False,
                "message": (
                    "Radius must be between "
                    "100 and 50000 meters."
                ),
            },
            status=400,
        )

    result = GooglePlacesService.search_nearby(
        latitude=latitude,
        longitude=longitude,
        place_type=category,
        radius=radius,
    )

    return Response(result)

@api_view(["POST"])
@permission_classes([AllowAny])
def sync_nearby_places(request):

    latitude = request.data.get(
        "latitude"
    )

    longitude = request.data.get(
        "longitude"
    )

    radius = request.data.get(
        "radius",
        5000,
    )

    if latitude is None or longitude is None:

        return Response(
            {
                "success": False,
                "message": (
                    "latitude and longitude "
                    "are required."
                ),
            },
            status=400,
        )

    try:

        latitude = float(latitude)
        longitude = float(longitude)
        radius = int(radius)

    except (TypeError, ValueError):

        return Response(
            {
                "success": False,
                "message": (
                    "Invalid coordinates "
                    "or radius."
                ),
            },
            status=400,
        )

    result = (
        GooglePlacesService.sync_nearby_places(
            latitude=latitude,
            longitude=longitude,
            radius=radius,
        )
    )

    return Response(result)

@api_view(["GET"])
@permission_classes([AllowAny])
def location_score(request):

    latitude = request.query_params.get(
        "latitude"
    )

    longitude = request.query_params.get(
        "longitude"
    )

    if not latitude or not longitude:

        return Response(
            {
                "success": False,
                "message": (
                    "latitude and longitude "
                    "are required."
                ),
            },
            status=400,
        )

    try:

        latitude = float(latitude)
        longitude = float(longitude)

    except ValueError:

        return Response(
            {
                "success": False,
                "message": "Invalid coordinates.",
            },
            status=400,
        )

    result = (
        PropertyLocationScoreService.refresh_from_google(
            latitude=latitude,
            longitude=longitude,
            radius=5000,
        )
    )

    return Response(
        {
            "success": True,
            "location": result,
        }
    )

@api_view(["GET"])
@permission_classes([AllowAny])
def directions(request):

    origin_latitude = request.query_params.get(
        "origin_latitude"
    )

    origin_longitude = request.query_params.get(
        "origin_longitude"
    )

    destination_latitude = request.query_params.get(
        "destination_latitude"
    )

    destination_longitude = request.query_params.get(
        "destination_longitude"
    )

    mode = request.query_params.get(
        "mode",
        "driving",
    )

    if not all([
        origin_latitude,
        origin_longitude,
        destination_latitude,
        destination_longitude,
    ]):

        return Response(
            {
                "success": False,
                "message": (
                    "Origin and destination "
                    "coordinates are required."
                ),
            },
            status=400,
        )

    try:

        origin_latitude = float(
            origin_latitude
        )

        origin_longitude = float(
            origin_longitude
        )

        destination_latitude = float(
            destination_latitude
        )

        destination_longitude = float(
            destination_longitude
        )

    except ValueError:

        return Response(
            {
                "success": False,
                "message": (
                    "Invalid coordinates."
                ),
            },
            status=400,
        )

    allowed_modes = [
        "driving",
        "walking",
        "bicycling",
        "transit",
    ]

    if mode not in allowed_modes:

        return Response(
            {
                "success": False,
                "message": (
                    "Invalid travel mode."
                ),
            },
            status=400,
        )

    result = (
        GoogleDirectionsService.get_directions(
            origin_latitude=origin_latitude,
            origin_longitude=origin_longitude,
            destination_latitude=destination_latitude,
            destination_longitude=destination_longitude,
            mode=mode,
        )
    )

    return Response(result)