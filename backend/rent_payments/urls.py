from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import RentPaymentViewSet
from .callbacks import rent_mpesa_callback


router = DefaultRouter()

router.register(
    "",
    RentPaymentViewSet,
    basename="rent-payment",
)

urlpatterns = router.urls

urlpatterns += [
    path(
        "mpesa-callback/",
        rent_mpesa_callback,
        name="rent-mpesa-callback",
    ),
]