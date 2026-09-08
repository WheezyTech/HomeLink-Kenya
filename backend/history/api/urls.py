from rest_framework.routers import DefaultRouter

from .views import RecentlyViewedViewSet

router = DefaultRouter()
router.register("", RecentlyViewedViewSet, basename="history")

urlpatterns = router.urls