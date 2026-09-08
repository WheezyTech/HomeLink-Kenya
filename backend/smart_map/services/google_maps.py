from math import atan2, cos, radians, sin, sqrt

from django.conf import settings


class GoogleMapsService:

    def __init__(self):
        self.api_key = getattr(
            settings,
            "GOOGLE_MAPS_API_KEY",
            None,
        )

    def nearby_places(
        self,
        latitude,
        longitude,
        place_type,
        radius=5000,
    ):

        # Development mode
        # Google Maps will replace this later.

        if not self.api_key:

            return self.mock_places(
                latitude,
                longitude,
                place_type,
            )

        # Google Places integration
        # will be connected here later.

        return []

    def calculate_distance(
        self,
        latitude1,
        longitude1,
        latitude2,
        longitude2,
    ):
        earth_radius = 6371

        lat1 = radians(float(latitude1))
        lon1 = radians(float(longitude1))

        lat2 = radians(float(latitude2))
        lon2 = radians(float(longitude2))

        dlat = lat2 - lat1
        dlon = lon2 - lon1

        a = (
            sin(dlat / 2) ** 2
            + cos(lat1)
            * cos(lat2)
            * sin(dlon / 2) ** 2
        )

        c = 2 * atan2(
            sqrt(a),
            sqrt(1 - a),
        )

        return round(
            earth_radius * c,
            2,
        )

    def mock_places(
        self,
        latitude,
        longitude,
        place_type,
    ):

        names = {

            "school": [
                "Eldoret Primary School",
                "Sunrise Academy",
                "Green Valley School",
            ],

            "hospital": [
                "Eldoret Medical Centre",
                "Valley Hospital",
                "Life Care Hospital",
            ],

            "supermarket": [
                "Naivas Supermarket",
                "Quickmart",
                "Chandarana Foodplus",
            ],

            "police": [
                "Central Police Station",
                "Kapsoya Police Post",
            ],

            "church": [
                "St. Paul's Church",
                "Grace Community Church",
            ],

            "mosque": [
                "Eldoret Central Mosque",
                "Kapsoya Mosque",
            ],

            "bus_station": [
                "Eldoret Bus Stage",
                "Town Bus Station",
                "Kapsoya Bus Stage",
            ],
        }

        results = []

        for index, name in enumerate(
            names.get(place_type, [])
        ):

            place_latitude = (
                float(latitude) + (index * 0.002)
            )

            place_longitude = (
                float(longitude) + (index * 0.002)
            )

            distance = self.calculate_distance(
                latitude,
                longitude,
                place_latitude,
                place_longitude,
            )

            results.append(
                {
                    "place_id": (
                        f"mock-{place_type}-{index}"
                    ),

                    "name": name,

                    "vicinity": "Near the property",

                    "rating": round(
                        4.0 + (index * 0.3),
                        1,
                    ),

                    "distance_km": distance,

                    "geometry": {
                        "location": {
                            "lat": place_latitude,
                            "lng": place_longitude,
                        }
                    },

                    "source": "mock",
                }
            )

        return results

    def directions(
        self,
        origin,
        destination,
    ):

        if not self.api_key:
            return {
                "source": "mock",
                "message": (
                    "Directions will be "
                    "enabled with Google Maps."
                ),
            }

        return []