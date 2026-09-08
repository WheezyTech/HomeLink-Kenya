from django.contrib import admin

from .models import RentalApplication


@admin.register(RentalApplication)
class RentalApplicationAdmin(admin.ModelAdmin):

    list_display = (
        "property",
        "tenant",
        "status",
        "created_at",
    )

    list_filter = (
        "status",
    )

    search_fields = (
        "tenant__email",
        "property__title",
    )