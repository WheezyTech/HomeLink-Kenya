from rest_framework.routers import DefaultRouter

from .views import ConversationViewSet

router = DefaultRouter()
router.register("", ConversationViewSet, basename="chat")

urlpatterns = router.urls