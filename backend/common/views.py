from django.conf import settings
from django.core.mail import send_mail
from rest_framework import generics, permissions
from rest_framework.response import Response

from .models import ContactSubmission
from .serializers import ContactSubmissionSerializer


class ContactSubmissionCreateView(generics.CreateAPIView):
    queryset = ContactSubmission.objects.all()
    serializer_class = ContactSubmissionSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()

        contact_email = getattr(settings, "CONTACT_SUPPORT_EMAIL", None) or settings.DEFAULT_FROM_EMAIL
        subject = instance.subject or "New contact enquiry"
        message = (
            f"Full Name: {instance.full_name}\n"
            f"Email: {instance.email}\n"
            f"Phone: {instance.phone or 'Not provided'}\n\n"
            f"Subject: {subject}\n\n"
            f"Message:\n{instance.message}"
        )

        try:
            send_mail(
                subject=f"HomeLink Kenya Contact: {subject}",
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[contact_email],
                fail_silently=True,
            )
        except Exception:
            pass

        return Response(
            {
                "message": "Your message has been received. Our team will get back to you soon.",
                "id": instance.id,
            },
            status=201,
        )
