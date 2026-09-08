from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    NearbyPlaceViewSet,
    nearby_places,
    location_score,
    sync_nearby_places,
    directions,
)


router = DefaultRouter()

router.register(
    "places",
    NearbyPlaceViewSet,
    basename="nearby-places",
)


urlpatterns = [
    path(
        "nearby/",
        nearby_places,
        name="nearby-places",
    ),

    path(
        "location-score/",
        location_score,
        name="location-score",
    ),

    path(
        "sync/",
        sync_nearby_places,
        name="sync-nearby-places",
    ),

    path(
        "directions/",
        directions,
        name="directions",
    ),
]

urlpatterns += router.urls