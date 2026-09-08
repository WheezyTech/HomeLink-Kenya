import uuid

from django.db import models


class PropertyDailyAnalytics(models.Model):

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    property = models.ForeignKey(
        "properties.Property",
        on_delete=models.CASCADE,
        related_name="daily_analytics",
    )

    date = models.DateField()

    views = models.PositiveIntegerField(default=0)

    favourites = models.PositiveIntegerField(default=0)

    bookings = models.PositiveIntegerField(default=0)

    chats = models.PositiveIntegerField(default=0)

    class Meta:

        unique_together = (
            "property",
            "date",
        )

        ordering = [
            "date",
        ]

    def __str__(self):

        return f"{self.property.title} ({self.date})"