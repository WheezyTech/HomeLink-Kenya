from rest_framework.routers import DefaultRouter

from .views import RentalApplicationViewSet

router = DefaultRouter()

router.register(
    "",
    RentalApplicationViewSet,
    basename="applications",
)

urlpatterns = router.urls