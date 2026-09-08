import logging

from rest_framework import serializers

from properties.models import Property, PropertyImage
from properties.services.location import LocationService
from reports.models import PropertyReport


logger = logging.getLogger(__name__)


class PropertyImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = PropertyImage

        fields = (
            "id",
            "property",
            "image",
            "is_cover",
            "uploaded_at",
        )

        read_only_fields = (
            "id",
            "property",
            "uploaded_at",
        )


class PropertySerializer(serializers.ModelSerializer):

    images = PropertyImageSerializer(
        many=True,
        read_only=True,
    )

    owner_name = serializers.CharField(
        source="owner.get_full_name",
        read_only=True,
    )

    owner_phone = serializers.CharField(
        source="owner.phone",
        read_only=True,
    )

    owner_verified = serializers.BooleanField(
        source="owner.is_verified",
        read_only=True,
    )

    cover_image = serializers.SerializerMethodField()

    trust_score = serializers.SerializerMethodField()

    views = serializers.IntegerField(
        source="analytics.views",
        read_only=True,
        default=0,
    )
    favourites = serializers.IntegerField(
        source="analytics.favourites",
        read_only=True,
        default=0,
    )
    bookings = serializers.IntegerField(
        source="analytics.bookings",
        read_only=True,
        default=0,
    )
    chats = serializers.IntegerField(
        source="analytics.chats",
        read_only=True,
        default=0,
    )
    popularity_score = serializers.IntegerField(
        source="analytics.popularity_score",
        read_only=True,
        default=0,
    )

    class Meta:

        model = Property

        fields = (
            "id",
            "owner",
            "owner_name",
            "owner_phone",
            "owner_verified",
            "title",
            "description",
            "property_type",
            "purpose",
            "category",
            "furnishing",
            "price",
            "county",
            "estate",
            "bedrooms",
            "bathrooms",
            "latitude",
            "longitude",
            "location_verified",
            "google_maps_url",
            "status",
            "approved_by",
            "approved_at",
            "rejection_reason",
            "is_featured",
            "featured_until",
            "is_verified",
            "verification_notes",
            "created_at",
            "updated_at",

            # Images
            "images",
            "cover_image",

            # Trust
            "trust_score",

            # Analytics
            "views",
            "favourites",
            "bookings",
            "chats",
            "popularity_score",
        )

        read_only_fields = (
            "id",
            "owner",
            "owner_name",
            "owner_phone",
            "approved_by",
            "approved_at",
            "is_verified",
            "verification_notes",
            "location_verified",
            "google_maps_url",
            "status",
            "is_featured",
            "featured_until",
            "created_at",
            "updated_at",
            "images",
            "cover_image",
            "trust_score",
            "views",
            "favourites",
            "bookings",
            "chats",
            "popularity_score",
        )

    def get_cover_image(self, obj):

        image = obj.images.filter(
            is_cover=True
        ).first()

        if not image:

            image = obj.images.first()

        if image and image.image:

            request = self.context.get("request")

            if request:
                return request.build_absolute_uri(
                    image.image.url
                )

            return image.image.url

        return None

    def get_trust_score(self, obj):
        checks = [
            ("owner_identity", "Owner identity verified", obj.owner.is_verified, 25),
            ("owner_phone", "Owner phone verified", obj.owner.phone_verified, 15),
            ("owner_email", "Owner email verified", obj.owner.email_verified, 10),
            ("listing_verified", "Listing reviewed by HomeLink", obj.is_verified, 25),
            ("location_verified", "Property location verified", obj.location_verified, 15),
            ("photos_added", "Property photos added", obj.images.exists(), 10),
        ]
        score = sum(weight for _, _, passed, weight in checks if passed)
        pending_reports = PropertyReport.objects.filter(
            property=obj,
            status=PropertyReport.Status.PENDING,
        ).count()
        report_penalty = min(pending_reports * 5, 20)
        score = max(score - report_penalty, 0)

        if score >= 90:
            label = "Highly trusted"
        elif score >= 70:
            label = "Trusted"
        elif score >= 40:
            label = "Partially verified"
        else:
            label = "Limited verification"

        return {
            "score": score,
            "label": label,
            "pending_reports": pending_reports,
            "report_penalty": report_penalty,
            "checks": [
                {"key": key, "label": label, "verified": bool(passed)}
                for key, label, passed, _ in checks
            ],
        }

    def create(self, validated_data):

        request = self.context["request"]

        # Avoid duplicate 'owner' kwarg if caller passed it via serializer.save(owner=...)
        owner_from_data = validated_data.pop("owner", None)

        property = Property(
            owner=(owner_from_data or request.user),
            **validated_data
        )

        if (
            property.latitude is not None
            and property.longitude is not None
        ):

            property.google_maps_url = (
                LocationService.generate_maps_url(
                    property.latitude,
                    property.longitude,
                )
            )

        property.save()

        logger.info(
            "Property created: %s by user %s",
            property.id,
            request.user.id,
        )

        return property

    def update(self, instance, validated_data):

        for attr, value in validated_data.items():

            setattr(
                instance,
                attr,
                value,
            )

        if (
            instance.latitude is not None
            and instance.longitude is not None
        ):

            instance.google_maps_url = (
                LocationService.generate_maps_url(
                    instance.latitude,
                    instance.longitude,
                )
            )

        instance.save()

        logger.info(
            "Property updated: %s",
            instance.id,
        )

        return instance