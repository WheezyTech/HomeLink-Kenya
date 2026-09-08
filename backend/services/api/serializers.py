from rest_framework import serializers

from services.models import (
    ServiceCategory,
    ServiceProvider,
    ServiceListing,
    ServiceListingImage,
    ServiceRequest,
)


class ServiceCategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = ServiceCategory
        fields = (
            "id",
            "name",
            "slug",
            "description",
            "icon",
            "is_active",
        )


class ServiceProviderSerializer(serializers.ModelSerializer):

    class Meta:
        model = ServiceProvider
        fields = (
            "id",
            "user",
            "provider_type",
            "business_name",
            "description",
            "phone",
            "email",
            "county",
            "town",
            "estate",
            "years_experience",
            "starting_price",
            "profile_image",
            "verification_status",
            "rating",
            "completed_jobs",
            "is_active",
        )

        read_only_fields = (
            "id",
            "user",
            "verification_status",
            "rating",
            "completed_jobs",
        )


class ServiceListingImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = ServiceListingImage

        fields = (
            "id",
            "listing",
            "image",
            "is_cover",
            "uploaded_at",
        )

        read_only_fields = (
            "id",
            "listing",
            "uploaded_at",
        )


class ServiceListingSerializer(serializers.ModelSerializer):

    provider_name = serializers.CharField(
        source="provider.business_name",
        read_only=True,
    )

    category_name = serializers.CharField(
        source="category.name",
        read_only=True,
    )

    provider_rating = serializers.DecimalField(
        source="provider.rating",
        max_digits=3,
        decimal_places=2,
        read_only=True,
    )

    provider_verified = serializers.SerializerMethodField()

    images = ServiceListingImageSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = ServiceListing

        fields = (
            "id",
            "provider",
            "provider_name",
            "provider_rating",
            "provider_verified",
            "category",
            "category_name",
            "title",
            "description",
            "pricing_type",
            "price",
            "duration_hours",
            "service_area",
            "is_available",
            "is_featured",
            "views",
            "completed_jobs",
            "images",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "provider",
            "provider_name",
            "provider_rating",
            "provider_verified",
            "category_name",
            "views",
            "completed_jobs",
            "images",
            "created_at",
            "updated_at",
        )

    def get_provider_verified(self, obj):
        return (
            obj.provider.verification_status
            == ServiceProvider.VerificationStatus.VERIFIED
        )


class ServiceRequestSerializer(serializers.ModelSerializer):

    property_title = serializers.CharField(
        source="property.title",
        read_only=True,
    )

    lease_status = serializers.CharField(
        source="lease.status",
        read_only=True,
    )

    listing_title = serializers.CharField(
        source="listing.title",
        read_only=True,
    )

    provider_name = serializers.CharField(
        source="provider.business_name",
        read_only=True,
    )

    customer_name = serializers.CharField(
        source="customer.get_full_name",
        read_only=True,
    )

    class Meta:
        model = ServiceRequest

        fields = (
            "id",
            "customer",
            "customer_name",
            "listing",
            "listing_title",
            "provider",
            "provider_name",
            "property",
            "property_title",
            "lease",
            "lease_status",
            "description",
            "service_location",
            "county",
            "preferred_date",
            "preferred_time",
            "budget",
            "customer_phone",
            "status",
            "provider_notes",
            "rejection_reason",
            "completed_at",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "customer",
            "customer_name",
            "listing_title",
            "provider",
            "provider_name",
            "property_title",
            "lease_status",
            "status",
            "provider_notes",
            "rejection_reason",
            "completed_at",
            "created_at",
            "updated_at",
        )

    def validate(self, attrs):
        property_obj = attrs.get("property")
        lease = attrs.get("lease")

        if lease and property_obj and lease.property_id != property_obj.id:
            raise serializers.ValidationError(
                {"lease": "The selected lease does not belong to this property."}
            )

        request = self.context.get("request")
        if lease and request and lease.tenant_id != request.user.id:
            raise serializers.ValidationError(
                {"lease": "You can only attach your own lease."}
            )

        return attrs

    def validate_preferred_date(self, value):

        from datetime import date

        if value < date.today():
            raise serializers.ValidationError(
                "Service date cannot be in the past."
            )

        return value

class ServiceProviderRegistrationSerializer(serializers.ModelSerializer):

    class Meta:
        model = ServiceProvider

        fields = (
            "provider_type",
            "business_name",
            "description",
            "phone",
            "email",
            "county",
            "town",
            "estate",
            "years_experience",
            "starting_price",
            "profile_image",
        )

    def validate_business_name(self, value):
        if ServiceProvider.objects.filter(
            business_name__iexact=value
        ).exists():
            raise serializers.ValidationError(
                "A service provider with this business name already exists."
            )

        return value

    def create(self, validated_data):

        user = self.context["request"].user

        if ServiceProvider.objects.filter(
            user=user
        ).exists():
            raise serializers.ValidationError(
                "You are already registered as a service provider."
            )

        provider = ServiceProvider.objects.create(
            user=user,
            **validated_data
        )

        return provider