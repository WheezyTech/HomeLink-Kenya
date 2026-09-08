import uuid

from django.conf import settings
from django.db import models


class AIUserProfile(models.Model):

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="ai_profile",
    )

    preferred_county = models.CharField(
        max_length=100,
        blank=True,
    )

    preferred_estate = models.CharField(
        max_length=100,
        blank=True,
    )

    preferred_property_type = models.CharField(
        max_length=50,
        blank=True,
    )

    average_budget = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )

    preferred_bedrooms = models.PositiveIntegerField(
        default=0,
    )

    favourite_count = models.PositiveIntegerField(
        default=0,
    )

    booking_count = models.PositiveIntegerField(
        default=0,
    )

    chat_count = models.PositiveIntegerField(
        default=0,
    )

    last_updated = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return self.user.email