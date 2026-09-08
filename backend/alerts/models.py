import uuid

from django.conf import settings
from django.db import models


class SavedSearch(models.Model):

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="saved_searches",
    )

    name = models.CharField(
        max_length=150,
    )

    location = models.CharField(
        max_length=255,
        blank=True,
    )

    property_type = models.CharField(
        max_length=100,
        blank=True,
    )

    min_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
    )

    max_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
    )

    bedrooms = models.PositiveIntegerField(
        null=True,
        blank=True,
    )

    bathrooms = models.PositiveIntegerField(
        null=True,
        blank=True,
    )

    is_active = models.BooleanField(
        default=True,
    )

    notify_email = models.BooleanField(
        default=True,
    )

    notify_push = models.BooleanField(
        default=True,
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
        return f"{self.user.email} - {self.name}"


class PropertyAlert(models.Model):

    class AlertType(models.TextChoices):
        NEW_PROPERTY = "NEW_PROPERTY", "New Property"
        PRICE_DROP = "PRICE_DROP", "Price Drop"
        PROPERTY_UPDATED = (
            "PROPERTY_UPDATED",
            "Property Updated",
        )

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="property_alerts",
    )

    saved_search = models.ForeignKey(
        SavedSearch,
        on_delete=models.CASCADE,
        related_name="alerts",
        null=True,
        blank=True,
    )

    property = models.ForeignKey(
        "properties.Property",
        on_delete=models.CASCADE,
        related_name="alerts",
    )

    alert_type = models.CharField(
        max_length=30,
        choices=AlertType.choices,
    )

    title = models.CharField(
        max_length=255,
    )

    message = models.TextField()

    is_read = models.BooleanField(
        default=False,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title