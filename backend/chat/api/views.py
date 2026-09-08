from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from chat.models import Conversation, Message
from properties.models import Property, PropertyAnalytics

from .serializers import (
    ConversationSerializer,
    MessageSerializer,
)


class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Conversation.objects.filter(
            tenant=self.request.user
        ) | Conversation.objects.filter(
            owner=self.request.user
        )

    def get_object(self):
        conversation = super().get_object()

        if self.request.user not in [
            conversation.tenant,
            conversation.owner,
        ]:
            raise PermissionDenied(
                "You are not part of this conversation."
            )

        return conversation

    @action(detail=False, methods=["post"])
    def start(self, request):

        property_id = request.data.get("property")

        try:
            property = Property.objects.get(id=property_id)

        except Property.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "Property not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if property.owner == request.user:
            return Response(
                {
                    "success": False,
                    "message": "You cannot start a conversation with yourself."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        conversation, created = Conversation.objects.get_or_create(
            property=property,
            tenant=request.user,
            owner=property.owner,
        )

        if created:
            analytics, _ = PropertyAnalytics.objects.get_or_create(
                property=property
            )

            analytics.chats += 1
            analytics.calculate_score()
            analytics.save(update_fields=["chats", "popularity_score"])

        serializer = self.get_serializer(conversation)

        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def send(self, request, pk=None):

        conversation = self.get_object()

        serializer = MessageSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        message = serializer.save(
            conversation=conversation,
            sender=request.user,
        )

        conversation.last_message_at = message.created_at
        conversation.save(update_fields=["last_message_at"])

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["get"])
    def messages(self, request, pk=None):

        conversation = self.get_object()

        conversation.messages.exclude(
            sender=request.user
        ).update(
            status=Message.Status.READ
        )

        messages = conversation.messages.all()

        serializer = MessageSerializer(
            messages,
            many=True
        )

        return Response(serializer.data)