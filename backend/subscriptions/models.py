import uuid

from django.conf import settings
from django.db import models
from django.utils import timezone


class SubscriptionPlan(models.Model):

    class PlanType(models.TextChoices):
        FREE = "FREE", "Free"
        LANDLORD_BASIC = "LANDLORD_BASIC", "Landlord Basic"
        LANDLORD_PREMIUM = "LANDLORD_PREMIUM", "Landlord Premium"
        AGENT = "AGENT", "Agent"
        COMMERCIAL = "COMMERCIAL", "Commercial"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    name = models.CharField(
        max_length=100,
    )

    plan_type = models.CharField(
        max_length=30,
        choices=PlanType.choices,
    )

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    duration_days = models.PositiveIntegerField(
        default=30,
    )

    # Listing Limits
    max_properties = models.PositiveIntegerField(
        default=5,
    )

    unlimited_properties = models.BooleanField(
        default=False,
    )

    # Premium Features
    featured_listing_limit = models.PositiveIntegerField(
        default=0,
    )

    analytics_enabled = models.BooleanField(
        default=False,
    )

    verified_badge = models.BooleanField(
        default=False,
    )

    priority_support = models.BooleanField(
        default=False,
    )

    is_active = models.BooleanField(
        default=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["price"]

    def __str__(self):
        return self.name


class UserSubscription(models.Model):

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="subscription",
    )

    plan = models.ForeignKey(
        SubscriptionPlan,
        on_delete=models.PROTECT,
    )

    payment = models.ForeignKey(
        "payments.Payment",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="subscriptions",
    )

    start_date = models.DateTimeField(
        auto_now_add=True,
    )

    end_date = models.DateTimeField()

    is_active = models.BooleanField(
        default=True,
    )

    auto_renew = models.BooleanField(
        default=False,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["-end_date"]

    @property
    def has_expired(self):
        return timezone.now() > self.end_date

    def __str__(self):
        return f"{self.user.email} - {self.plan.name}"