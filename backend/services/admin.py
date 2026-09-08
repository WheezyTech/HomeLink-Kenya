from django.contrib import admin
from django.utils import timezone

from .models import (
    ServiceCategory,
    ServiceProvider,
    ServiceListing,
    ServiceListingImage,
    ServiceRequest,
)


@admin.action(description="Verify selected providers")
def verify_providers(modeladmin, request, queryset):

    queryset.update(
        verification_status=ServiceProvider.VerificationStatus.VERIFIED
    )


@admin.action(description="Reject selected providers")
def reject_providers(modeladmin, request, queryset):

    queryset.update(
        verification_status=ServiceProvider.VerificationStatus.REJECTED
    )


@admin.action(description="Suspend selected providers")
def suspend_providers(modeladmin, request, queryset):

    queryset.update(
        verification_status=ServiceProvider.VerificationStatus.SUSPENDED,
        is_active=False,
    )


@admin.action(description="Activate selected providers")
def activate_providers(modeladmin, request, queryset):

    queryset.update(
        is_active=True
    )


@admin.register(ServiceCategory)
class ServiceCategoryAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "slug",
        "is_active",
    )

    list_filter = (
        "is_active",
    )

    search_fields = (
        "name",
        "slug",
    )


class ServiceListingImageInline(admin.TabularInline):

    model = ServiceListingImage
    extra = 0


@admin.register(ServiceProvider)
class ServiceProviderAdmin(admin.ModelAdmin):

    list_display = (
        "business_name",
        "provider_type",
        "user",
        "county",
        "town",
        "verification_status",
        "rating",
        "completed_jobs",
        "is_active",
    )

    list_filter = (
        "provider_type",
        "verification_status",
        "is_active",
        "county",
    )

    search_fields = (
        "business_name",
        "user__email",
        "phone",
        "county",
        "town",
        "estate",
    )

    actions = (
        verify_providers,
        reject_providers,
        suspend_providers,
        activate_providers,
    )

    readonly_fields = (
        "rating",
        "completed_jobs",
    )


@admin.register(ServiceListing)
class ServiceListingAdmin(admin.ModelAdmin):

    list_display = (
        "title",
        "provider",
        "category",
        "price",
        "is_available",
        "is_featured",
        "views",
        "completed_jobs",
    )

    list_filter = (
        "category",
        "is_available",
        "is_featured",
    )

    search_fields = (
        "title",
        "description",
        "provider__business_name",
    )

    inlines = (
        ServiceListingImageInline,
    )


@admin.register(ServiceListingImage)
class ServiceListingImageAdmin(admin.ModelAdmin):

    list_display = (
        "listing",
        "is_cover",
        "uploaded_at",
    )


@admin.register(ServiceRequest)
class ServiceRequestAdmin(admin.ModelAdmin):

    list_display = (
        "listing",
        "customer",
        "provider",
        "status",
        "preferred_date",
        "budget",
        "created_at",
    )

    list_filter = (
        "status",
        "preferred_date",
    )

    search_fields = (
        "customer__email",
        "provider__business_name",
        "listing__title",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
        "completed_at",
    )