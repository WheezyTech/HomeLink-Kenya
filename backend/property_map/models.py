import uuid

from django.db import models


class NearbyPlace(models.Model):

    class PlaceType(models.TextChoices):
        SCHOOL = "SCHOOL", "School"
        HOSPITAL = "HOSPITAL", "Hospital"
        SUPERMARKET = "SUPERMARKET", "Supermarket"
        POLICE = "POLICE", "Police Station"
        CHURCH = "CHURCH", "Church"
        MOSQUE = "MOSQUE", "Mosque"
        BUS_STAGE = "BUS_STAGE", "Bus Stage"
        RESTAURANT = "RESTAURANT", "Restaurant"
        BANK = "BANK", "Bank"
        PHARMACY = "PHARMACY", "Pharmacy"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    name = models.CharField(
        max_length=255,
    )

    place_type = models.CharField(
        max_length=30,
        choices=PlaceType.choices,
    )

    address = models.CharField(
        max_length=500,
        blank=True,
    )

    latitude = models.DecimalField(
        max_digits=10,
        decimal_places=7,
    )

    longitude = models.DecimalField(
        max_digits=10,
        decimal_places=7,
    )

    phone = models.CharField(
        max_length=30,
        blank=True,
    )

    website = models.URLField(
        blank=True,
    )

    rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        null=True,
        blank=True,
    )

    distance_km = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True,
    )

    is_verified = models.BooleanField(
        default=False,
    )

    source = models.CharField(
        max_length=50,
        default="GOOGLE",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = [
            "distance_km",
            "name",
        ]

    def __str__(self):
        return f"{self.name} - {self.place_type}"