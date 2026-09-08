from django.contrib import admin

from .models import Conversation, Message


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):

    list_display = (
        "property",
        "tenant",
        "owner",
        "last_message_at",
        "created_at",
    )

    search_fields = (
        "property__title",
        "tenant__email",
        "owner__email",
    )

    list_filter = (
        "created_at",
    )


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):

    list_display = (
        "conversation",
        "sender",
        "message_type",
        "status",
        "is_deleted",
        "created_at",
    )

    search_fields = (
        "sender__email",
        "message",
    )

    list_filter = (
        "message_type",
        "status",
        "is_deleted",
    )