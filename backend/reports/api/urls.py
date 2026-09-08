from rest_framework.routers import DefaultRouter

from .views import PropertyReportViewSet

router = DefaultRouter()
router.register("", PropertyReportViewSet, basename="reports")

urlpatterns = router.urls