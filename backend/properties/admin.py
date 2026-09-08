from django.contrib import admin
from django.utils import timezone

from .models import Property, PropertyImage, PropertyAnalytics


@admin.action(description="Approve selected properties")
def approve_properties(modeladmin, request, queryset):
    queryset.update(
        status=Property.Status.APPROVED,
        approved_by=request.user,
        approved_at=timezone.now(),
        rejection_reason="",
    )


@admin.action(description="Reject selected properties")
def reject_properties(modeladmin, request, queryset):
    queryset.update(
        status=Property.Status.REJECTED,
        approved_by=request.user,
        approved_at=timezone.now(),
    )


@admin.action(description="Feature selected properties")
def feature_properties(modeladmin, request, queryset):
    queryset.update(
        is_featured=True,
    )


@admin.action(description="Remove featured status")
def unfeature_properties(modeladmin, request, queryset):
    queryset.update(
        is_featured=False,
    )


class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 0


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):

    list_display = (
        "title",
        "owner",
        "property_type",
        "price",
        "status",
        "is_featured",
        "created_at",
    )

    list_filter = (
        "status",
        "property_type",
        "is_featured",
    )

    search_fields = (
        "title",
        "owner__email",
        "county",
        "estate",
    )

    readonly_fields = (
        "approved_at",
    )

    inlines = [
        PropertyImageInline,
    ]

    actions = [
        approve_properties,
        reject_properties,
        feature_properties,
        unfeature_properties,
    ]


@admin.register(PropertyImage)
class PropertyImageAdmin(admin.ModelAdmin):

    list_display = (
        "property",
        "uploaded_at",
    )

@admin.register(PropertyAnalytics)
class PropertyAnalyticsAdmin(admin.ModelAdmin):

    list_display = (
        "property",
        "views",
        "favourites",
        "bookings",
        "chats",
        "popularity_score",
        "updated_at",
    )

    search_fields = (
        "property__title",
    )

@admin.action(description="Verify selected locations")
def verify_locations(modeladmin, request, queryset):

    queryset.update(location_verified=True)