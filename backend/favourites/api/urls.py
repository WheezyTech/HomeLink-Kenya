from rest_framework.routers import DefaultRouter

from .views import FavouriteViewSet

router = DefaultRouter()
router.register("", FavouriteViewSet, basename="favourites")

urlpatterns = router.urls