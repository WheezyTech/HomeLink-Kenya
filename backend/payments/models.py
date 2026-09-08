import uuid

from django.conf import settings
from django.db import models


class Payment(models.Model):

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        SUCCESS = "SUCCESS", "Success"
        FAILED = "FAILED", "Failed"
        CANCELLED = "CANCELLED", "Cancelled"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="payments",
    )

    subscription = models.ForeignKey(
        "subscriptions.SubscriptionPlan",
        on_delete=models.PROTECT,
        related_name="payments",
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    phone_number = models.CharField(
        max_length=20,
    )

    merchant_request_id = models.CharField(
        max_length=255,
        blank=True,
    )

    checkout_request_id = models.CharField(
        max_length=255,
        blank=True,
        db_index=True,
    )

    mpesa_receipt_number = models.CharField(
        max_length=100,
        blank=True,
    )

    transaction_date = models.DateTimeField(
        null=True,
        blank=True,
    )

    result_code = models.CharField(
        max_length=10,
        blank=True,
    )

    result_description = models.TextField(
        blank=True,
    )

    callback_payload = models.JSONField(
        null=True,
        blank=True,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} - {self.amount}"