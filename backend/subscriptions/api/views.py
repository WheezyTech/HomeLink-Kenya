from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny

from subscriptions.models import SubscriptionPlan
from .serializers import SubscriptionPlanSerializer


class SubscriptionPlanListAPIView(ListAPIView):
    queryset = SubscriptionPlan.objects.filter(
        is_active=True
    ).order_by("price")

    serializer_class = SubscriptionPlanSerializer
    permission_classes = [AllowAny]