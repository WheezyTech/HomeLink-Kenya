from django.db import transaction
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from services.models import (
    ServiceCategory,
    ServiceProvider,
    ServiceListing,
    ServiceRequest,
)

from .serializers import (
    ServiceCategorySerializer,
    ServiceProviderSerializer,
    ServiceProviderRegistrationSerializer,
    ServiceListingSerializer,
    ServiceRequestSerializer,
)
from accounts.api.serializers import RegisterSerializer
from accounts.services.verification import create_email_verification, create_phone_otp
from subscriptions.services import SubscriptionService


class ServiceCategoryViewSet(viewsets.ReadOnlyModelViewSet):

    serializer_class = ServiceCategorySerializer
    permission_classes = []

    def get_queryset(self):

        return ServiceCategory.objects.filter(
            is_active=True
        )


class ServiceProviderViewSet(viewsets.ReadOnlyModelViewSet):

    serializer_class = ServiceProviderSerializer

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_fields = {
        "provider_type": ["exact"],
        "county": ["exact"],
        "town": ["exact"],
        "estate": ["exact"],
        "verification_status": ["exact"],
    }

    search_fields = [
        "business_name",
        "description",
        "county",
        "town",
        "estate",
        "provider_type",
    ]

    ordering_fields = [
        "rating",
        "completed_jobs",
        "created_at",
    ]

    ordering = [
        "-rating",
        "-completed_jobs",
    ]

    def get_queryset(self):

        return ServiceProvider.objects.filter(
            verification_status=ServiceProvider.VerificationStatus.VERIFIED,
            is_active=True,
        ).select_related(
            "user"
        )

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[IsAuthenticated],
        url_path="me",
    )
    def me(self, request):

        try:
            provider = request.user.service_provider

        except ServiceProvider.DoesNotExist:

            return Response(
                {
                    "registered": False,
                    "message": "You are not registered as a service provider.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(
            {
                "registered": True,
                "provider": ServiceProviderSerializer(
                    provider,
                    context={
                        "request": request,
                    },
                ).data,
            }
        )

    @action(
        detail=True,
        methods=["get"],
    )
    def listings(self, request, pk=None):

        provider = self.get_object()

        listings = ServiceListing.objects.filter(
            provider=provider,
            is_available=True,
        ).select_related(
            "category"
        )

        serializer = ServiceListingSerializer(
            listings,
            many=True,
            context={
                "request": request,
            },
        )

        return Response(serializer.data)


class ServiceListingViewSet(viewsets.ModelViewSet):

    serializer_class = ServiceListingSerializer

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_fields = {
        "category": ["exact"],
        "provider": ["exact"],
        "price": ["gte", "lte"],
        "provider__county": ["exact"],
        "provider__town": ["exact"],
        "is_featured": ["exact"],
    }

    search_fields = [
        "title",
        "description",
        "provider__county",
        "provider__town",
        "provider__business_name",
    ]

    ordering_fields = [
        "price",
        "views",
        "completed_jobs",
        "created_at",
    ]

    ordering = [
        "-is_featured",
        "-created_at",
    ]

    def get_permissions(self):

        if self.action in [
            "list",
            "retrieve",
        ]:
            return []

        return [IsAuthenticated()]

    def get_queryset(self):

        queryset = ServiceListing.objects.filter(
            is_available=True,
            provider__verification_status=(
                ServiceProvider.VerificationStatus.VERIFIED
            ),
            provider__is_active=True,
        ).select_related(
            "provider",
            "category",
        )

        # Provider dashboard can see their own listings
        if self.request.user.is_authenticated:

            try:
                provider = self.request.user.service_provider

                if self.action in [
                    "update",
                    "partial_update",
                    "destroy",
                ]:
                    return ServiceListing.objects.filter(
                        provider=provider
                    ).select_related(
                        "provider",
                        "category",
                    )

            except ServiceProvider.DoesNotExist:
                pass

        return queryset

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[IsAuthenticated],
        url_path="mine",
    )
    def mine(self, request):

        try:
            provider = request.user.service_provider

        except ServiceProvider.DoesNotExist:

            return Response(
                {
                    "registered": False,
                    "message": "You are not registered as a service provider.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        listings = ServiceListing.objects.filter(
            provider=provider
        ).select_related(
            "provider",
            "category",
        )

        serializer = self.get_serializer(
            listings,
            many=True,
        )

        return Response(serializer.data)

    def perform_create(self, serializer):

        try:
            provider = self.request.user.service_provider

        except ServiceProvider.DoesNotExist:

            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied(
                "You must register as a service provider first."
            )

        if (
            provider.verification_status
            != ServiceProvider.VerificationStatus.VERIFIED
        ):
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied(
                "Your service provider account must be verified before creating services."
            )

        serializer.save(
            provider=provider
        )

    def retrieve(self, request, *args, **kwargs):

        instance = self.get_object()

        instance.views += 1

        instance.save(
            update_fields=["views"]
        )

        return super().retrieve(
            request,
            *args,
            **kwargs
        )


class ServiceRequestViewSet(viewsets.ModelViewSet):

    serializer_class = ServiceRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        user = self.request.user

        if user.is_staff:

            return ServiceRequest.objects.all().select_related(
                "customer",
                "provider",
                "listing",
            )

        try:

            provider = user.service_provider

        except ServiceProvider.DoesNotExist:

            provider = None

        if provider:

            return ServiceRequest.objects.filter(
                Q(customer=user)
                | Q(provider=provider)
            ).select_related(
                "customer",
                "provider",
                "listing",
                "property",
                "lease",
            )

        return ServiceRequest.objects.filter(
            customer=user
        ).select_related(
            "customer",
            "provider",
            "listing",
            "property",
            "lease",
        )

    def create(self, request, *args, **kwargs):

        listing_id = request.data.get(
            "listing"
        )

        try:

            listing = ServiceListing.objects.select_related(
                "provider"
            ).get(
                id=listing_id,
                is_available=True,
            )

        except ServiceListing.DoesNotExist:

            return Response(
                {
                    "success": False,
                    "message": "Service listing not found or unavailable.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if listing.provider.user == request.user:

            return Response(
                {
                    "success": False,
                    "message": "You cannot hire your own service.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save(
            customer=request.user,
            provider=listing.provider,
        )

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )

    @action(
        detail=True,
        methods=["post"],
    )
    def accept(self, request, pk=None):

        service_request = self.get_object()

        try:

            provider = request.user.service_provider

        except ServiceProvider.DoesNotExist:

            return Response(
                {
                    "success": False,
                    "message": "You are not registered as a service provider.",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        if service_request.provider != provider:

            return Response(
                {
                    "success": False,
                    "message": "You cannot manage this request.",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        if service_request.status != ServiceRequest.Status.PENDING:

            return Response(
                {
                    "success": False,
                    "message": "Only pending requests can be accepted.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        service_request.status = ServiceRequest.Status.ACCEPTED

        service_request.save(
            update_fields=[
                "status",
                "updated_at",
            ]
        )

        return Response(
            {
                "success": True,
                "message": "Service request accepted.",
            }
        )

    @action(
        detail=True,
        methods=["post"],
    )
    def reject(self, request, pk=None):

        service_request = self.get_object()

        try:

            provider = request.user.service_provider

        except ServiceProvider.DoesNotExist:

            return Response(
                {
                    "success": False,
                    "message": "You are not registered as a service provider.",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        if service_request.provider != provider:

            return Response(
                {
                    "success": False,
                    "message": "You cannot manage this request.",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        if service_request.status != ServiceRequest.Status.PENDING:

            return Response(
                {
                    "success": False,
                    "message": "Only pending requests can be rejected/Avoided.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        reason = request.data.get(
            "rejection_reason",
            ""
        )

        service_request.status = ServiceRequest.Status.REJECTED
        service_request.rejection_reason = reason

        service_request.save(
            update_fields=[
                "status",
                "rejection_reason",
                "updated_at",
            ]
        )

        return Response(
            {
                "success": True,
                "message": "Service request rejected.",
            }
        )

    @action(
        detail=True,
        methods=["post"],
    )
    def cancel(self, request, pk=None):

        service_request = self.get_object()

        if service_request.customer != request.user:

            return Response(
                {
                    "success": False,
                    "message": "Only the customer can cancel this request.",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        if service_request.status not in [
            ServiceRequest.Status.PENDING,
            ServiceRequest.Status.ACCEPTED,
        ]:

            return Response(
                {
                    "success": False,
                    "message": "This request cannot be cancelled.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        service_request.status = ServiceRequest.Status.CANCELLED

        service_request.save(
            update_fields=[
                "status",
                "updated_at",
            ]
        )

        return Response(
            {
                "success": True,
                "message": "Service request cancelled.",
            }
        )

    @action(
        detail=True,
        methods=["post"],
    )
    def start(self, request, pk=None):

        service_request = self.get_object()

        if service_request.provider.user != request.user:

            return Response(
                {
                    "success": False,
                    "message": "Only the service provider can start this job.",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        if service_request.status != ServiceRequest.Status.ACCEPTED:

            return Response(
                {
                    "success": False,
                    "message": "Only accepted requests can be started.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        service_request.status = ServiceRequest.Status.IN_PROGRESS

        service_request.save(
            update_fields=[
                "status",
                "updated_at",
            ]
        )

        return Response(
            {
                "success": True,
                "message": "Service job started.",
            }
        )

    @action(
        detail=True,
        methods=["post"],
    )
    def complete(self, request, pk=None):

        from django.utils import timezone

        service_request = self.get_object()

        if service_request.provider.user != request.user:

            return Response(
                {
                    "success": False,
                    "message": "Only the service provider can complete this job.",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        if service_request.status != ServiceRequest.Status.IN_PROGRESS:

            return Response(
                {
                    "success": False,
                    "message": "Only jobs in progress can be completed.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        service_request.status = ServiceRequest.Status.COMPLETED
        service_request.completed_at = timezone.now()

        service_request.save(
            update_fields=[
                "status",
                "completed_at",
                "updated_at",
            ]
        )

        provider = service_request.provider

        provider.completed_jobs += 1

        provider.save(
            update_fields=["completed_jobs"]
        )

        service_request.listing.completed_jobs += 1

        service_request.listing.save(
            update_fields=["completed_jobs"]
        )

        return Response(
            {
                "success": True,
                "message": "Service job completed.",
            }
        )

class ServiceProviderRegistrationAPIView(APIView):

    permission_classes = [AllowAny]

    def get(self, request):

        try:
            provider = request.user.service_provider

        except ServiceProvider.DoesNotExist:

            return Response(
                {
                    "registered": False,
                    "message": "You are not registered as a service provider.",
                }
            )

        return Response(
            {
                "registered": True,
                "provider": ServiceProviderSerializer(
                    provider
                ).data,
            }
        )

    def post(self, request):

        if not request.user.is_authenticated:
            return self.register_new_provider_account(request)

        if ServiceProvider.objects.filter(
            user=request.user
        ).exists():

            return Response(
                {
                    "success": False,
                    "message": "You are already registered as a service provider.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = ServiceProviderRegistrationSerializer(
            data=request.data,
            context={
                "request": request
            },
        )

        serializer.is_valid(
            raise_exception=True
        )

        provider = serializer.save()

        return Response(
            {
                "success": True,
                "message": (
                    "Service provider registration submitted successfully. "
                    "Your account is awaiting Approval."
                ),
                "provider": ServiceProviderSerializer(
                    provider
                ).data,
            },
            status=status.HTTP_201_CREATED,
        )

    @transaction.atomic
    def register_new_provider_account(self, request):
        account_field_names = (
            "first_name",
            "last_name",
            "username",
            "email",
            "phone",
            "password",
            "confirm_password",
        )
        account_data = {
            field_name: request.data.get(field_name)
            for field_name in account_field_names
        }
        account_data["email"] = request.data.get("account_email")
        account_data["phone"] = request.data.get("account_phone")

        account_serializer = RegisterSerializer(data=account_data)
        provider_serializer = ServiceProviderRegistrationSerializer(
            data=request.data,
        )

        account_is_valid = account_serializer.is_valid()
        provider_is_valid = provider_serializer.is_valid()

        if not account_is_valid or not provider_is_valid:
            errors = {}
            if not account_is_valid:
                errors.update(account_serializer.errors)
            if not provider_is_valid:
                errors.update(provider_serializer.errors)

            return Response(
                {
                    "success": False,
                    "message": "Please correct the highlighted registration details.",
                    "errors": errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = account_serializer.save()
        provider = ServiceProvider.objects.create(
            user=user,
            **provider_serializer.validated_data,
        )

        SubscriptionService.assign_free_plan(user)
        create_email_verification(user)
        create_phone_otp(user)

        return Response(
            {
                "success": True,
                "message": (
                    "Account and service provider profile created. "
                    "Verify your email and phone before logging in. "
                    "Your provider profile is awaiting approval."
                ),
                "user": {
                    "id": str(user.id),
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "username": user.username,
                    "email": user.email,
                    "phone": user.phone,
                    "role": user.role,
                },
                "provider": ServiceProviderSerializer(provider).data,
            },
            status=status.HTTP_201_CREATED,
        )

class ServiceProviderRequestViewSet(viewsets.ModelViewSet):

    serializer_class = ServiceRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        try:
            provider = self.request.user.service_provider
        except ServiceProvider.DoesNotExist:
            return ServiceRequest.objects.none()

        return ServiceRequest.objects.filter(
            provider=provider
        ).select_related(
            "customer",
            "listing",
            "listing__category",
        ).order_by("-created_at")

    @action(
        detail=True,
        methods=["post"],
    )
    def accept(self, request, pk=None):

        service_request = self.get_object()

        if service_request.status != ServiceRequest.Status.PENDING:

            return Response(
                {
                    "success": False,
                    "message": "Only pending requests can be accepted.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        service_request.status = (
            ServiceRequest.Status.ACCEPTED
        )

        service_request.save(
            update_fields=[
                "status",
                "updated_at",
            ]
        )

        return Response(
            {
                "success": True,
                "message": "Service request accepted.",
                "request": self.get_serializer(
                    service_request
                ).data,
            }
        )

    @action(
        detail=True,
        methods=["post"],
    )
    def reject(self, request, pk=None):

        service_request = self.get_object()

        if service_request.status != ServiceRequest.Status.PENDING:

            return Response(
                {
                    "success": False,
                    "message": "Only pending requests can be rejected.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        service_request.status = (
            ServiceRequest.Status.REJECTED
        )

        service_request.save(
            update_fields=[
                "status",
                "updated_at",
            ]
        )

        return Response(
            {
                "success": True,
                "message": "Service request rejected.",
            }
        )

    @action(
        detail=True,
        methods=["post"],
    )
    def start(self, request, pk=None):

        service_request = self.get_object()

        if service_request.status != ServiceRequest.Status.ACCEPTED:

            return Response(
                {
                    "success": False,
                    "message": "Only accepted requests can be started.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        service_request.status = (
            ServiceRequest.Status.IN_PROGRESS
        )

        service_request.save(
            update_fields=[
                "status",
                "updated_at",
            ]
        )

        return Response(
            {
                "success": True,
                "message": "Job started.",
            }
        )

    @action(
        detail=True,
        methods=["post"],
    )
    def complete(self, request, pk=None):

        service_request = self.get_object()

        if service_request.status != ServiceRequest.Status.IN_PROGRESS:

            return Response(
                {
                    "success": False,
                    "message": "Only jobs in progress can be completed.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        service_request.status = (
            ServiceRequest.Status.COMPLETED
        )

        service_request.save(
            update_fields=[
                "status",
                "updated_at",
            ]
        )

        return Response(
            {
                "success": True,
                "message": "Job marked as completed.",
            }
        )