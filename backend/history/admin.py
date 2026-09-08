from django.contrib import admin

from .models import RecentlyViewed


@admin.register(RecentlyViewed)
class RecentlyViewedAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "property",
        "viewed_at",
    )

    search_fields = (
        "user__email",
        "property__title",
    )

    list_filter = (
        "viewed_at",
    )

    ordering = (
        "-viewed_at",
    )