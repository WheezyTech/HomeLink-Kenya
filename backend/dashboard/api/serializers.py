from rest_framework import serializers


class DashboardSerializer(serializers.Serializer):

    total_properties = serializers.IntegerField()

    approved_properties = serializers.IntegerField()

    pending_properties = serializers.IntegerField()

    rented_properties = serializers.IntegerField()

    featured_properties = serializers.IntegerField()

    total_views = serializers.IntegerField()

    total_favourites = serializers.IntegerField()

    total_bookings = serializers.IntegerField()

    total_chats = serializers.IntegerField()

    active_subscription = serializers.CharField()

    subscription_expiry = serializers.DateTimeField(
        allow_null=True
    )

    remaining_property_slots = serializers.IntegerField(
        allow_null=True
    )