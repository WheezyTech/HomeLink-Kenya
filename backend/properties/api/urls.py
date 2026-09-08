from django.urls import path
from rest_framework.routers import DefaultRouter

from .analytics import DashboardAnalyticsAPIView
from .views import PropertyViewSet

router = DefaultRouter()
router.register("", PropertyViewSet, basename="properties")

urlpatterns = router.urls + [
    path(
        "dashboard/",
        DashboardAnalyticsAPIView.as_view(),
        name="property-dashboard",
    ),
]