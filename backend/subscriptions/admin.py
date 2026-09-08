from django.contrib import admin

from .models import SubscriptionPlan, UserSubscription


@admin.register(SubscriptionPlan)
class SubscriptionPlanAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "plan_type",
        "price",
        "duration_days",
        "max_properties",
        "unlimited_properties",
        "featured_listing_limit",
        "analytics_enabled",
        "verified_badge",
        "priority_support",
        "is_active",
    )

    list_filter = (
        "plan_type",
        "is_active",
        "analytics_enabled",
        "verified_badge",
    )

    search_fields = (
        "name",
    )

    ordering = (
        "price",
    )


@admin.register(UserSubscription)
class UserSubscriptionAdmin(admin.ModelAdmin):

    list_display = (
        "user",
        "plan",
        "start_date",
        "end_date",
        "is_active",
        "auto_renew",
        "has_expired_display",
    )

    list_filter = (
        "is_active",
        "auto_renew",
        "plan",
    )

    search_fields = (
        "user__email",
        "user__username",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    @admin.display(boolean=True, description="Expired")
    def has_expired_display(self, obj):
        return obj.has_expired