import secrets
from datetime import timedelta

from django.conf import settings
from django.core.mail import send_mail
from django.urls import reverse
from django.utils import timezone

from accounts.models import (
    EmailVerificationToken,
    PhoneOTP,
)
from accounts.services.sms import send_otp_sms

def create_email_verification(user):
    # Invalidate previous unused tokens
    EmailVerificationToken.objects.filter(
        user=user,
        is_used=False,
    ).update(is_used=True)

    token = EmailVerificationToken.objects.create(
        user=user,
        expires_at=timezone.now() + timedelta(hours=24),
    )

    verification_url = (
        f"{settings.FRONTEND_URL}/verify-email/{token.token}/"
    )

    send_mail(
        "Verify your HomeLink Kenya account",
        (
            f"Hello {user.first_name or user.username},\n\n"
            "Thank you for registering with HomeLink Kenya.\n\n"
            "Click the link below to verify your email:\n\n"
            f"{verification_url}\n\n"
            "This link expires in 24 hours."
        ),
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )

    return token


def create_phone_otp(user):

    PhoneOTP.objects.filter(
        user=user,
        is_used=False,
    ).update(
        is_used=True
    )

    otp = f"{secrets.randbelow(1_000_000):06d}"

    phone_otp = PhoneOTP.objects.create(
        user=user,
        otp=otp,
        expires_at=timezone.now() + timedelta(
            minutes=10
        ),
    )

    if user.phone:
        sent = send_otp_sms(
            user.phone,
            otp,
        )

        if not sent:
            print(
                f"Phone OTP created for {user.phone}: {otp}"
            )

    return phone_otp


def account_is_verified(user):
    if user.email_verified and user.phone_verified:
        user.is_verified = True
        user.save(update_fields=["is_verified"])
        return True

    return False