import uuid

from django.conf import settings
from django.db import models


class RecentlyViewed(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="recently_viewed",
    )

    property = models.ForeignKey(
        "properties.Property",
        on_delete=models.CASCADE,
        related_name="view_history",
    )

    viewed_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        unique_together = ("user", "property")
        ordering = ["-viewed_at"]

    def __str__(self):
        return f"{self.user.email} viewed {self.property.title}"