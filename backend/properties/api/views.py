from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend

from properties.models import (
    Property,
    PropertyImage,
    PropertyAnalytics,
    PropertyDailyAnalytics,
)
from properties.services.subscription import SubscriptionService

from .moderation import PropertyModerationMixin
from .serializers import (
    PropertySerializer,
    PropertyImageSerializer,
)
from .permissions import PropertyPermission

class PropertyViewSet(PropertyModerationMixin, viewsets.ModelViewSet):

    permission_classes = [PropertyPermission]

    serializer_class = PropertySerializer

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
    ]

    filterset_fields = {
        "purpose": ["exact"],
        "category": ["exact"],
        "county": ["exact"],
        "estate": ["exact"],
        "property_type": ["exact"],
        "bedrooms": ["exact"],
        "price": ["gte", "lte"],
        "is_featured": ["exact"],
        "is_verified": ["exact"],
    }

    search_fields = [
        "title",
        "description",
        "county",
        "estate",
    ]

    def get_queryset(self):

        user = self.request.user

        # Admin can see everything
        if user.is_authenticated and user.is_staff:
            return Property.objects.all().order_by(
                "-is_featured",
                "-created_at",
            )

        # Public pages
        if self.action in ["list", "retrieve"]:
            return Property.objects.filter(
                status=Property.Status.APPROVED
            ).order_by(
                "-is_featured",
                "-created_at",
            )

        # Dashboard pages
        if user.is_authenticated:
            return Property.objects.filter(
                owner=user
            ).order_by("-created_at")

        return Property.objects.none()

    def retrieve(self, request, *args, **kwargs):

        response = super().retrieve(request, *args, **kwargs)

        property = self.get_object()

        analytics, created = PropertyAnalytics.objects.get_or_create(
            property=property
        )

        analytics.views += 1
        analytics.calculate_score()
        analytics.save(update_fields=["views", "popularity_score"])

        today = timezone.localdate()

        daily, created = PropertyDailyAnalytics.objects.get_or_create(
            property=property,
            date=today,
        )

        daily.views += 1
        daily.save(update_fields=["views"])

        return response
    
    def perform_create(self, serializer):

        allowed, message = SubscriptionService.can_create_property(
            self.request.user
        )

        if not allowed:
            raise PermissionDenied(message)

        property = serializer.save(
            owner=self.request.user
        )

        PropertyAnalytics.objects.get_or_create(
            property=property
        )

        from alerts.services import PropertyAlertService

        PropertyAlertService.notify_matching_users(
            property
        )

    @action(
        detail=True,
        methods=["post"],
    )
    def feature(self, request, pk=None):

        property = self.get_object()

        if property.owner != request.user:
            return Response(
                {
                    "success": False,
                    "message": "You can only feature your own property.",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        success, message = SubscriptionService.feature_property(
            property
        )

        return Response(
            {
                "success": success,
                "message": message,
            },
            status=(
                status.HTTP_200_OK
                if success
                else status.HTTP_400_BAD_REQUEST
            ),
        )

    @action(
        detail=False,
        methods=["get"],
    )
    def my_properties(self, request):

        queryset = Property.objects.filter(
            owner=request.user
        ).order_by("-created_at")

        serializer = self.get_serializer(
            queryset,
            many=True,
        )

        return Response(serializer.data)


class PropertyImageUploadAPIView(APIView):

    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):

        property_id = request.data.get("property")

        try:

            property = Property.objects.get(
                id=property_id,
                owner=request.user,
            )

        except Property.DoesNotExist:

            return Response(
                {
                    "success": False,
                    "message": "You do not own this property.",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        image_count = PropertyImage.objects.filter(
            property=property
        ).count()

        if image_count >= 20:

            return Response(
                {
                    "success": False,
                    "message": "Maximum 20 images allowed.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = PropertyImageSerializer(
            data=request.data
        )

        if serializer.is_valid():

            image = serializer.save(
                property=property
            )

            if image_count == 0:
                image.is_cover = True
                image.save(
                    update_fields=["is_cover"]
                )

            return Response(
                {
                    "success": True,
                    "message": "Image uploaded successfully.",
                    "image": serializer.data,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )