from django.contrib import admin

from .models import Lease


@admin.register(Lease)
class LeaseAdmin(admin.ModelAdmin):

    list_display = (
        "property",
        "landlord",
        "tenant",
        "monthly_rent",
        "status",
        "start_date",
        "end_date",
    )

    list_filter = (
        "status",
    )

    search_fields = (
        "property__title",
        "tenant__email",
        "landlord__email",
    )