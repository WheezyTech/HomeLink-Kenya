from django.contrib import admin

from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):

    list_display = (
        "property",
        "tenant",
        "landlord",
        "viewing_date",
        "viewing_time",
        "status",
    )

    list_filter = (
        "status",
        "viewing_date",
    )

    search_fields = (
        "tenant__email",
        "landlord__email",
        "property__title",
    )

    ordering = (
        "-created_at",
    )