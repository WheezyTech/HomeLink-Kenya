from rest_framework.routers import DefaultRouter

from .views import PaymentViewSet
from .callbacks import mpesa_callback
from django.urls import path

router = DefaultRouter()
router.register("", PaymentViewSet, basename="payments")

urlpatterns = router.urls

urlpatterns += [
    path(
        "callback/",
        mpesa_callback,
        name="mpesa-callback",
    ),
]