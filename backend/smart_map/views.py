from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .services.google_maps import GoogleMapsService
from properties.models import Property

class NearbyPlacesAPIView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        latitude = request.query_params.get(
            "latitude"
        )

        longitude = request.query_params.get(
            "longitude"
        )

        radius = request.query_params.get(
            "radius",
            5000,
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

            radius = int(radius)

            maps = GoogleMapsService()

            categories = {
                "schools": "school",
                "hospitals": "hospital",
                "supermarkets": "supermarket",
                "police": "police",
                "churches": "church",
                "mosques": "mosque",
                "bus_stages": "bus_station",
            }

            nearby = {}

            for name, place_type in categories.items():

                nearby[name] = maps.nearby_places(
                    latitude=latitude,
                    longitude=longitude,
                    place_type=place_type,
                    radius=radius,
                )

            return Response(
                {
                    "success": True,
                    "location": {
                        "latitude": float(latitude),
                        "longitude": float(longitude),
                    },
                    "radius": radius,
                    "nearby": nearby,
                }
            )

        except ValueError as error:

            return Response(
                {
                    "success": False,
                    "message": str(error),
                },
                status=400,
            )

        except Exception as error:

            return Response(
                {
                    "success": False,
                    "message": (
                        "Unable to retrieve "
                        "nearby places."
                    ),
                    "error": str(error),
                },
                status=500,
            )

class PropertySmartMapAPIView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request, property_id):

        try:

            property = Property.objects.get(
                id=property_id
            )

        except Property.DoesNotExist:

            return Response(
                {
                    "success": False,
                    "message": "Property not found.",
                },
                status=404,
            )

        if (
            property.latitude is None
            or property.longitude is None
        ):

            return Response(
                {
                    "success": False,
                    "message": (
                        "This property does not "
                        "have map coordinates yet."
                    ),
                },
                status=400,
            )

        maps = GoogleMapsService()

        latitude = float(property.latitude)
        longitude = float(property.longitude)

        categories = {
            "schools": "school",
            "hospitals": "hospital",
            "supermarkets": "supermarket",
            "police": "police",
            "churches": "church",
            "mosques": "mosque",
            "bus_stages": "bus_station",
        }

        nearby = {}

        for name, place_type in categories.items():

            nearby[name] = maps.nearby_places(
                latitude=latitude,
                longitude=longitude,
                place_type=place_type,
                radius=5000,
            )

        return Response(
            {
                "success": True,

                "property": {
                    "id": str(property.id),
                    "title": property.title,
                    "latitude": latitude,
                    "longitude": longitude,
                },

                "nearby": nearby,

                "traffic": {
                    "available": False,
                    "message": (
                        "Traffic information will "
                        "be enabled with Google Maps."
                    ),
                },
            }
        )