import uuid

from django.conf import settings
from django.db import models


class PropertyReport(models.Model):

    class Reason(models.TextChoices):
        FAKE_OWNER = "FAKE_OWNER", "Fake Owner"
        WRONG_LOCATION = "WRONG_LOCATION", "Wrong Location"
        ALREADY_RENTED = "ALREADY_RENTED", "Already Rented"
        DUPLICATE = "DUPLICATE", "Duplicate Listing"
        FRAUD = "FRAUD", "Fraud"
        INAPPROPRIATE = "INAPPROPRIATE", "Inappropriate Content"
        OTHER = "OTHER", "Other"

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        UNDER_REVIEW = "UNDER_REVIEW", "Under Review"
        RESOLVED = "RESOLVED", "Resolved"
        REJECTED = "REJECTED", "Rejected"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    property = models.ForeignKey(
        "properties.Property",
        on_delete=models.CASCADE,
        related_name="reports",
    )

    reporter = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="submitted_reports",
    )

    reason = models.CharField(
        max_length=30,
        choices=Reason.choices,
    )

    description = models.TextField()

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )

    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reviewed_reports",
    )

    reviewed_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    moderator_notes = models.TextField(
        blank=True,
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
        return f"{self.property.title} ({self.reason})"