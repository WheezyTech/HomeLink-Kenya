from django.contrib import admin
from django.utils import timezone

from .models import RentPayment


@admin.register(RentPayment)
class RentPaymentAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "receipt_number",
        "tenant",
        "landlord",
        "lease",
        "amount_due",
        "amount_paid",
        "due_date",
        "status",
        "mpesa_receipt_number",
        "paid_at",
        "created_at",
    )

    list_filter = (
        "status",
        "due_date",
        "paid_at",
        "created_at",
    )

    search_fields = (
        "tenant__email",
        "tenant__first_name",
        "tenant__last_name",
        "landlord__email",
        "landlord__first_name",
        "landlord__last_name",
        "receipt_number",
        "mpesa_receipt_number",
        "checkout_request_id",
        "payment_reference",
        "lease__id",
        "lease__property__title",
    )

    readonly_fields = (
        "id",
        "amount_paid",
        "paid_at",
        "mpesa_receipt_number",
        "checkout_request_id",
        "merchant_request_id",
        "payment_reference",
        "receipt_number",
        "created_at",
        "updated_at",
    )

    ordering = (
        "-created_at",
    )

    list_per_page = 25

    actions = [
        "mark_as_paid",
    ]

    @admin.action(
        description="Mark selected rent payments as PAID"
    )
    def mark_as_paid(self, request, queryset):

        updated = 0

        for rent in queryset:

            if rent.status == RentPayment.Status.PAID:
                continue

            rent.amount_paid = rent.amount_due

            rent.status = RentPayment.Status.PAID

            rent.paid_at = timezone.now()

            if not rent.receipt_number:

                rent.receipt_number = (
                    f"HL-"
                    f"{timezone.localdate().strftime('%Y%m%d')}-"
                    f"{str(rent.id).replace('-', '')[:8].upper()}"
                )

            rent.notes = (
                "Marked as paid by administrator."
            )

            rent.save(
                update_fields=[
                    "amount_paid",
                    "status",
                    "paid_at",
                    "receipt_number",
                    "notes",
                    "updated_at",
                ]
            )

            updated += 1

        self.message_user(
            request,
            f"{updated} rent payment(s) marked as paid.",
        )