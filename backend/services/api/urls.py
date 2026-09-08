from rest_framework.routers import DefaultRouter

from .views import (
    ServiceCategoryViewSet,
    ServiceProviderViewSet,
    ServiceListingViewSet,
    ServiceRequestViewSet,
    ServiceProviderRequestViewSet,
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


urlpatterns = router.urls