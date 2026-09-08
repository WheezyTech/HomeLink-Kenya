from rest_framework.routers import DefaultRouter

from .views import (
    SavedSearchViewSet,
    PropertyAlertViewSet,
)


router = DefaultRouter()

router.register(
    "saved-searches",
    SavedSearchViewSet,
    basename="saved-searches",
)

router.register(
    "alerts",
    PropertyAlertViewSet,
    basename="property-alerts",
)

urlpatterns = router.urls