import uuid
from django.db import models


class PropertyAnalytics(models.Model):

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    property = models.OneToOneField(
        "properties.Property",
        on_delete=models.CASCADE,
        related_name="analytics",
    )

    views = models.PositiveIntegerField(default=0)
    favourites = models.PositiveIntegerField(default=0)
    bookings = models.PositiveIntegerField(default=0)
    chats = models.PositiveIntegerField(default=0)
    popularity_score = models.PositiveIntegerField(default=0)

    updated_at = models.DateTimeField(auto_now=True)

    def calculate_score(self):
        self.popularity_score = (
            self.views
            + (self.favourites * 5)
            + (self.bookings * 10)
            + (self.chats * 7)
        )

    def __str__(self):
        return self.property.title