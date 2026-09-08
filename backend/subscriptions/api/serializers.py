from rest_framework import serializers

from subscriptions.models import SubscriptionPlan, UserSubscription


class SubscriptionPlanSerializer(serializers.ModelSerializer):

    class Meta:
        model = SubscriptionPlan
        fields = [
            "id",
            "name",
            "plan_type",
            "price",
            "duration_days",
            "max_properties",
        ]


class UserSubscriptionSerializer(serializers.ModelSerializer):

    plan = SubscriptionPlanSerializer(read_only=True)

    class Meta:
        model = UserSubscription
        fields = [
            "id",
            "plan",
            "start_date",
            "end_date",
            "is_active",
        ]