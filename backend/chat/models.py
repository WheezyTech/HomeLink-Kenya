import uuid

from django.conf import settings
from django.db import models


class Conversation(models.Model):

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    property = models.ForeignKey(
        "properties.Property",
        on_delete=models.CASCADE,
        related_name="conversations",
    )

    tenant = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="tenant_conversations",
    )

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="owner_conversations",
    )

    last_message_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:

        ordering = [
            "-last_message_at",
            "-updated_at",
        ]

        constraints = [
            models.UniqueConstraint(
                fields=[
                    "property",
                    "tenant",
                ],
                name="unique_property_conversation",
            )
        ]

    def __str__(self):

        return (
            f"{self.tenant.email} ↔ "
            f"{self.owner.email}"
        )


class Message(models.Model):

    class Status(models.TextChoices):
        SENT = "SENT", "Sent"
        DELIVERED = "DELIVERED", "Delivered"
        READ = "READ", "Read"

    class MessageType(models.TextChoices):

        TEXT = "TEXT", "Text"

        IMAGE = "IMAGE", "Image"

        LOCATION = "LOCATION", "Location"

        PROPERTY = "PROPERTY", "Property"

        SYSTEM = "SYSTEM", "System"

        AUDIO = "AUDIO", "Audio"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name="messages",
    )

    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="sent_messages",
    )

    message = models.TextField(
        blank=True,
    )

    reply_to = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="replies",
    )

    message_type = models.CharField(
        max_length=20,
        choices=MessageType.choices,
        default=MessageType.TEXT,
    )

    image = models.ImageField(
        upload_to="chat/",
        blank=True,
        null=True,
    )

    status = models.CharField(
        max_length=15,
        choices=Status.choices,
        default=Status.SENT,
    )

    is_deleted = models.BooleanField(
        default=False,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:

        ordering = [
            "created_at",
        ]

    def __str__(self):

        if self.message:

            return (
                f"{self.sender.email}: "
                f"{self.message[:30]}"
            )

        return (
            f"{self.sender.email}: "
            f"{self.message_type}"
        )