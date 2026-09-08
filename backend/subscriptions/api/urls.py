from django.urls import path

from .views import SubscriptionPlanListAPIView


urlpatterns = [
    path(
        "",
        SubscriptionPlanListAPIView.as_view(),
        name="subscription-plans",
    ),
]