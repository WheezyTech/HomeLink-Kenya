from rest_framework import serializers

from history.models import RecentlyViewed


class RecentlyViewedSerializer(serializers.ModelSerializer):
    property_title = serializers.CharField(
        source="property.title",
        read_only=True,
    )

    property_price = serializers.DecimalField(
        source="property.price",
        max_digits=12,
        decimal_places=2,
        read_only=True,
    )

    property_image = serializers.SerializerMethodField()

    class Meta:
        model = RecentlyViewed
        fields = (
            "id",
            "property",
            "property_title",
            "property_price",
            "property_image",
            "viewed_at",
        )

    def get_property_image(self, obj):
        cover = obj.property.images.filter(is_cover=True).first()

        if cover:
            return cover.image.url

        return None