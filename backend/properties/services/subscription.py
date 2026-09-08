from django.utils import timezone

from subscriptions.models import UserSubscription
from properties.models import Property
from datetime import timedelta

class SubscriptionService:
    """
    Handles all subscription validation for property creation.
    """

    @staticmethod
    def get_active_subscription(user):
        """
        Returns the user's active subscription or None.
        """
        try:
            subscription = UserSubscription.objects.select_related("plan").get(
                user=user,
                is_active=True,
            )

            # Check expiry
            if subscription.end_date < timezone.now():
                subscription.is_active = False
                subscription.save(update_fields=["is_active"])
                return None

            return subscription

        except UserSubscription.DoesNotExist:
            return None

    @staticmethod
    def can_create_property(user):
        """
        Checks whether a user is allowed to create another property.

        Returns:
            (True, None) if allowed

            (False, "reason") if not allowed
        """

        subscription = SubscriptionService.get_active_subscription(user)

        if subscription is None:
            return False, "You do not have an active subscription."

        plan = subscription.plan

        # Unlimited plan
        if plan.unlimited_properties:
            return True, None

        current_properties = Property.objects.filter(
            owner=user
        ).count()

        if current_properties >= plan.max_properties:
            return (
                False,
                f"You have reached your property limit ({plan.max_properties}). Please upgrade your subscription."
            )

        return True, None

    @staticmethod
    def can_feature_property(user):
        """
        Checks whether a user can feature another property.
        """

        subscription = SubscriptionService.get_active_subscription(user)

        if subscription is None:
            return False, "No active subscription."

        plan = subscription.plan

        if plan.featured_listing_limit == 0:
            return False, "Your subscription does not allow featured listings."

        featured_count = Property.objects.filter(
            owner=user,
            is_featured=True,
        ).count()

        if featured_count >= plan.featured_listing_limit:
            return (
                False,
                f"You have reached your featured listing limit ({plan.featured_listing_limit}).",
            )

        return True, None

    @staticmethod
    def remaining_property_slots(user):
        """
        Returns the number of remaining property slots.
        Returns None for unlimited plans.
        """

        subscription = SubscriptionService.get_active_subscription(user)

        if subscription is None:
            return 0

        plan = subscription.plan

        if plan.unlimited_properties:
            return None

        used = Property.objects.filter(owner=user).count()

        remaining = plan.max_properties - used

        return max(remaining, 0)
    
    @staticmethod
    def can_access_analytics(user):
        """
        Checks whether the user can access analytics.
        """

        subscription = SubscriptionService.get_active_subscription(user)

        if subscription is None:
            return False

        return subscription.plan.analytics_enabled

    @staticmethod
    def has_verified_badge(user):
        """
        Checks whether the user's subscription includes a verified badge.
        """

        subscription = SubscriptionService.get_active_subscription(user)

        if subscription is None:
            return False

        return subscription.plan.verified_badge

    @staticmethod
    def has_priority_support(user):
        """
        Checks whether the user's subscription includes priority support.
        """

        subscription = SubscriptionService.get_active_subscription(user)

        if subscription is None:
            return False

        return subscription.plan.priority_support

    @staticmethod
    def feature_property(property):

        subscription = SubscriptionService.get_active_subscription(
            property.owner
        )

        if subscription is None:
            return False, "No active subscription."

        allowed, message = SubscriptionService.can_feature_property(
            property.owner
        )

        if not allowed:
            return False, message

        property.is_featured = True

        property.featured_until = timezone.now() + timedelta(
            days=30
        )

        property.save(
            update_fields=[
                "is_featured",
                "featured_until",
            ]
        )

        return True, "Property featured successfully."