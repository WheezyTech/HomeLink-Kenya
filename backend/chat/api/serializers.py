from rest_framework import serializers

from chat.models import Conversation, Message


class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(
        source="sender.get_full_name",
        read_only=True
    )

    sender_email = serializers.CharField(
        source="sender.email",
        read_only=True
    )

    class Meta:
        model = Message
        fields = (
            "id",
            "sender",
            "sender_name",
            "sender_email",
            "message",
            "message_type",
            "image",
            "status",
            "created_at",
        )

        read_only_fields = (
            "id",
            "sender",
            "status",
            "created_at",
        )


class ConversationSerializer(serializers.ModelSerializer):
    property_title = serializers.CharField(
        source="property.title",
        read_only=True
    )

    tenant_name = serializers.CharField(
        source="tenant.get_full_name",
        read_only=True
    )

    owner_name = serializers.CharField(
        source="owner.get_full_name",
        read_only=True,
    )

    last_message = serializers.SerializerMethodField()
    unread_messages = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = (
            "id",
            "property",
            "property_title",
            "tenant",
            "tenant_name",
            "owner",
            "owner_name",
            "last_message",
            "unread_messages",
            "updated_at",
        )

    def get_last_message(self, obj):
        last = obj.messages.last()

        if last:
            return MessageSerializer(last).data

        return None

    def get_unread_messages(self, obj):
        request = self.context.get("request")

        if not request or not request.user:
            return 0

        return obj.messages.filter(
            status=Message.Status.SENT
        ).exclude(
            sender=request.user
        ).count()