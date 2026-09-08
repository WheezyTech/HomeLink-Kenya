import math

import requests

from django.conf import settings


class GooglePlacesService:

    BASE_URL = (
        "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    )

    @classmethod
    def search_nearby(
        cls,
        latitude,
        longitude,
        place_type,
        radius=5000,
    ):
        api_key = getattr(
            settings,
            "GOOGLE_MAPS_API_KEY",
            "",
        )

        if not api_key:
            return {
                "success": False,
                "message": (
                    "Google Maps API key is not configured."
                ),
                "results": [],
            }

        params = {
            "location": (
                f"{latitude},{longitude}"
            ),
            "radius": radius,
            "type": place_type,
            "key": api_key,
        }

        try:

            response = requests.get(
                cls.BASE_URL,
                params=params,
                timeout=15,
            )

            response.raise_for_status()

            data = response.json()

            if data.get("status") not in (
                "OK",
                "ZERO_RESULTS",
            ):
                return {
                    "success": False,
                    "message": data.get(
                        "error_message",
                        data.get(
                            "status",
                            "Google Places request failed.",
                        ),
                    ),
                    "results": [],
                }

            results = []

            for place in data.get(
                "results",
                [],
            ):

                location = place.get(
                    "geometry",
                    {},
                ).get(
                    "location",
                    {},
                )

                place_lat = location.get(
                    "lat"
                )

                place_lng = location.get(
                    "lng"
                )

                distance = None

                if (
                    place_lat is not None
                    and place_lng is not None
                ):
                    distance = (
                        cls.calculate_distance(
                            float(latitude),
                            float(longitude),
                            float(place_lat),
                            float(place_lng),
                        )
                    )

                results.append(
                    {
                        "google_place_id":
                            place.get("place_id"),

                        "name":
                            place.get(
                                "name",
                                "",
                            ),

                        "place_type":
                            place_type.upper(),

                        "address":
                            place.get(
                                "vicinity",
                                "",
                            ),

                        "latitude":
                            place_lat,

                        "longitude":
                            place_lng,

                        "rating":
                            place.get(
                                "rating"
                            ),

                        "distance_km":
                            distance,

                        "is_verified":
                            False,

                        "source":
                            "GOOGLE",
                    }
                )

            return {
                "success": True,
                "message": "Places retrieved.",
                "results": results,
            }

        except requests.RequestException as error:

            return {
                "success": False,
                "message": str(error),
                "results": [],
            }

    @classmethod
    def sync_nearby_places(
        cls,
        latitude,
        longitude,
        radius=5000,
    ):
        from .models import NearbyPlace

        categories = [
            "school",
            "hospital",
            "supermarket",
            "police",
            "church",
            "mosque",
            "bus_station",
        ]

        results = []

        for category in categories:

            response = cls.search_nearby(
                latitude=latitude,
                longitude=longitude,
                place_type=category,
                radius=radius,
            )

            if not response.get("success"):
                continue

            for place in response.get(
                "results",
                [],
            ):

                google_place_id = place.get(
                    "google_place_id"
                )

                if not google_place_id:
                    continue

                defaults = {
                    "name": place.get(
                        "name",
                        "",
                    ),
                    "place_type": (
                        category.upper()
                    ),
                    "address": place.get(
                        "address",
                        "",
                    ),
                    "latitude": place.get(
                        "latitude"
                    ),
                    "longitude": place.get(
                        "longitude"
                    ),
                    "rating": place.get(
                        "rating"
                    ),
                    "distance_km": place.get(
                        "distance_km"
                    ),
                    "source": "GOOGLE",
                }

                nearby_place, created = (
                    NearbyPlace.objects.update_or_create(
                        google_place_id=google_place_id,
                        defaults=defaults,
                    )
                )

                results.append(
                    {
                        "id": str(
                            nearby_place.id
                        ),
                        "name": nearby_place.name,
                        "category": (
                            nearby_place.place_type
                        ),
                        "created": created,
                    }
                )

        return {
            "success": True,
            "count": len(results),
            "results": results,
        }
    @staticmethod
    def calculate_distance(
        lat1,
        lon1,
        lat2,
        lon2,
    ):
        """
        Calculate approximate distance
        between two coordinates in kilometers.
        """

        earth_radius = 6371

        lat1 = math.radians(lat1)
        lat2 = math.radians(lat2)

        delta_lat = math.radians(
            lat2 - lat1
        )

        delta_lon = math.radians(
            lon2 - lon1
        )

        a = (
            math.sin(delta_lat / 2) ** 2
            + math.cos(lat1)
            * math.cos(lat2)
            * math.sin(delta_lon / 2) ** 2
        )

        c = 2 * math.atan2(
            math.sqrt(a),
            math.sqrt(1 - a),
        )

        return round(
            earth_radius * c,
            2,
        )


class GoogleDirectionsService:

    DIRECTIONS_URL = (
        "https://maps.googleapis.com/maps/api/directions/json"
    )

    @classmethod
    def get_directions(
        cls,
        origin_latitude,
        origin_longitude,
        destination_latitude,
        destination_longitude,
        mode="driving",
    ):
        api_key = getattr(
            settings,
            "GOOGLE_MAPS_API_KEY",
            "",
        )

        if not api_key:

            return {
                "success": False,
                "configured": False,
                "message": (
                    "Google Maps API key "
                    "is not configured."
                ),
                "route": None,
            }

        origin = (
            f"{origin_latitude},{origin_longitude}"
        )

        destination = (
            f"{destination_latitude},"
            f"{destination_longitude}"
        )

        params = {
            "origin": origin,
            "destination": destination,
            "mode": mode,
            "key": api_key,
        }

        # Traffic-aware routing for driving
        if mode == "driving":

            params["departure_time"] = "now"

        try:

            response = requests.get(
                cls.DIRECTIONS_URL,
                params=params,
                timeout=15,
            )

            response.raise_for_status()

            data = response.json()

        except requests.RequestException as exc:

            return {
                "success": False,
                "configured": True,
                "message": (
                    "Unable to connect to "
                    "Google Directions."
                ),
                "error": str(exc),
                "route": None,
            }

        status = data.get("status")

        if status != "OK":

            return {
                "success": False,
                "configured": True,
                "message": (
                    data.get(
                        "error_message"
                    )
                    or f"Google Directions "
                       f"returned {status}."
                ),
                "route": None,
            }

        routes = data.get(
            "routes",
            [],
        )

        if not routes:

            return {
                "success": False,
                "configured": True,
                "message": "No route found.",
                "route": None,
            }

        route = routes[0]

        legs = route.get(
            "legs",
            [],
        )

        if not legs:

            return {
                "success": False,
                "configured": True,
                "message": "No route details found.",
                "route": None,
            }

        leg = legs[0]

        distance = leg.get(
            "distance",
            {},
        )

        duration = leg.get(
            "duration",
            {},
        )

        duration_traffic = leg.get(
            "duration_in_traffic",
            {},
        )

        return {
            "success": True,
            "configured": True,

            "route": {
                "distance": distance.get(
                    "text"
                ),

                "distance_meters": distance.get(
                    "value"
                ),

                "duration": duration.get(
                    "text"
                ),

                "duration_seconds": duration.get(
                    "value"
                ),

                "duration_in_traffic": (
                    duration_traffic.get(
                        "text"
                    )
                    if duration_traffic
                    else None
                ),

                "duration_in_traffic_seconds": (
                    duration_traffic.get(
                        "value"
                    )
                    if duration_traffic
                    else None
                ),

                "start_address": leg.get(
                    "start_address"
                ),

                "end_address": leg.get(
                    "end_address"
                ),

                "start_location": leg.get(
                    "start_location"
                ),

                "end_location": leg.get(
                    "end_location"
                ),

                "steps": [
                    {
                        "instruction": step.get(
                            "html_instructions"
                        ),
                        "distance": step.get(
                            "distance",
                            {},
                        ).get("text"),
                        "duration": step.get(
                            "duration",
                            {},
                        ).get("text"),
                    }
                    for step in leg.get(
                        "steps",
                        [],
                    )
                ],

                "overview_polyline": (
                    route.get(
                        "overview_polyline",
                        {},
                    ).get(
                        "points"
                    )
                ),
            },
        }