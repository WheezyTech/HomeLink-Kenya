from rest_framework.routers import DefaultRouter

from .views import ServiceReviewViewSet


router = DefaultRouter()

router.register(
    "service-reviews",
    ServiceReviewViewSet,
    basename="service-reviews",
)

urlpatterns = router.urls