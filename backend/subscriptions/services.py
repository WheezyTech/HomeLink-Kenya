from datetime import timedelta

from django.utils import timezone

from subscriptions.models import SubscriptionPlan, UserSubscription


class SubscriptionService:

    @staticmethod
    def activate(user, plan, payment):

        end_date = timezone.now() + timedelta(
            days=plan.duration_days
        )

        subscription, created = UserSubscription.objects.update_or_create(
            user=user,
            defaults={
                "plan": plan,
                "payment": payment,
                "start_date": timezone.now(),
                "end_date": end_date,
                "is_active": True,
            },
        )

        return subscription

    @staticmethod
    def get_active_subscription(user):

        return UserSubscription.objects.filter(
            user=user,
            is_active=True,
            end_date__gte=timezone.now(),
        ).order_by("-start_date").first()

    @staticmethod
    def remaining_property_slots(user):

        subscription = SubscriptionService.get_active_subscription(user)

        if not subscription:
            return 0

        plan = subscription.plan

        if plan.unlimited_properties:
            return None

        plan_limit = plan.max_properties

        current_count = user.properties.count()

        return max(
            plan_limit - current_count,
            0
        )

    @staticmethod
    def assign_free_plan(user):

        plan = SubscriptionPlan.objects.filter(
            plan_type=SubscriptionPlan.PlanType.FREE,
            is_active=True,
        ).first()

        if not plan:
            return None

        subscription, created = UserSubscription.objects.get_or_create(
            user=user,
            defaults={
                "plan": plan,
                "end_date": timezone.now() + timedelta(
                    days=plan.duration_days
                ),
                "is_active": True,
            },
        )

        return subscription