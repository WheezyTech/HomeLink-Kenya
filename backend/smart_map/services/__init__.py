import googlemaps

from django.conf import settings


class GoogleMapsService:

    def __init__(self):

        if not settings.GOOGLE_MAPS_API_KEY:
            raise ValueError(
                "GOOGLE_MAPS_API_KEY is not configured."
            )

        self.client = googlemaps.Client(
            key=settings.GOOGLE_MAPS_API_KEY
        )

    def nearby_places(
        self,
        latitude,
        longitude,
        place_type,
        radius=5000,
    ):

        location = (
            float(latitude),
            float(longitude),
        )

        response = self.client.places_nearby(
            location=location,
            radius=radius,
            type=place_type,
        )

        return response.get(
            "results",
            []
        )

    def directions(
        self,
        origin,
        destination,
    ):

        return self.client.directions(
            origin,
            destination,
            mode="driving",
        )