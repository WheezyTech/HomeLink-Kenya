import uuid

from django.conf import settings
from django.db import models

from leases.models import Lease


class RentPayment(models.Model):

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        PAID = "PAID", "Paid"
        PARTIAL = "PARTIAL", "Partial"
        OVERDUE = "OVERDUE", "Overdue"
        FAILED = "FAILED", "Failed"
        CANCELLED = "CANCELLED", "Cancelled"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    lease = models.ForeignKey(
        Lease,
        on_delete=models.CASCADE,
        related_name="rent_payments",
    )

    tenant = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="rent_payments",
    )

    landlord = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="received_rent_payments",
    )

    amount_due = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    amount_paid = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )

    due_date = models.DateField()

    paid_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )

    mpesa_receipt_number = models.CharField(
        max_length=100,
        blank=True,
    )

    checkout_request_id = models.CharField(
        max_length=100,
        blank=True,
    )

    merchant_request_id = models.CharField(
        max_length=100,
        blank=True,
    )

    phone_number = models.CharField(
        max_length=20,
        blank=True,
    )

    payment_reference = models.CharField(
        max_length=100,
        unique=True,
        null=True,
        blank=True,
    )

    receipt_number = models.CharField(
        max_length=100,
        unique=True,
        null=True,
        blank=True,
    )
    
    notes = models.TextField(
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["-due_date"]
        constraints = [
            models.UniqueConstraint(
                fields=[
                    "lease",
                    "due_date",
                ],
                name="unique_lease_rent_due_date",
            )
        ]

    def __str__(self):
        return (
            f"{self.tenant.email} - "
            f"{self.due_date} - "
            f"{self.amount_due}"
        )