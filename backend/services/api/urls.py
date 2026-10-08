from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    ServiceCategoryViewSet,
    ServiceProviderViewSet,
    ServiceListingViewSet,
    ServiceRequestViewSet,
    ServiceProviderRequestViewSet,
    ServiceProviderRegistrationAPIView,
)


router = DefaultRouter()

router.register(
    "categories",
    ServiceCategoryViewSet,
    basename="service-categories",
)

router.register(
    "providers",
    ServiceProviderViewSet,
    basename="service-providers",
)

router.register(
    "listings",
    ServiceListingViewSet,
    basename="service-listings",
)

router.register(
    "provider/requests",
    ServiceProviderRequestViewSet,
    basename="provider-service-requests",
)

router.register(
    "requests",
    ServiceRequestViewSet,
    basename="service-requests",
)


urlpatterns = [
    path(
        "providers/register/",
        ServiceProviderRegistrationAPIView.as_view(),
        name="service-provider-register",
    ),
    *router.urls,
]