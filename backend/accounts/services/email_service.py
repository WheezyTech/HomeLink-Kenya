from django.conf import settings
from django.core.mail import send_mail


class EmailService:

    @staticmethod
    def send_verification_email(user, token):

        verification_url = (
            f"{settings.FRONTEND_URL}"
            f"/verify-email/{token}/"
        )

        subject = "Verify your HomeLink Kenya account"

        message = f"""
Hello {user.first_name},

Welcome to HomeLink Kenya.

Please verify your email address by opening the link below:

{verification_url}

This verification link will expire after 24 hours.

If you did not create this account, you can safely ignore this email.

Regards,
HomeLink Kenya
"""

        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )