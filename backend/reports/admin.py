from django.contrib import admin

from .models import PropertyReport


@admin.register(PropertyReport)
class PropertyReportAdmin(admin.ModelAdmin):

    list_display = (
        "property",
        "reporter",
        "reason",
        "status",
        "created_at",
    )

    list_filter = (
        "reason",
        "status",
    )

    search_fields = (
        "property__title",
        "reporter__email",
    )

    ordering = (
        "-created_at",
    )