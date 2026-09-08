from django.urls import path

from .views import NearbyPlacesAPIView, PropertySmartMapAPIView


urlpatterns = [
    path(
        "nearby/",
        NearbyPlacesAPIView.as_view(),
        name="nearby-places",
    ),

    path(
        "property/<uuid:property_id>/",
        PropertySmartMapAPIView.as_view(),
        name="property-smart-map",
    ),
]