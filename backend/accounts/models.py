import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models
import secrets
from datetime import timedelta

from django.conf import settings
from django.utils import timezone
from .managers import UserManager


class User(AbstractUser):

    class Roles(models.TextChoices):
        TENANT = "TENANT", "Tenant"
        LANDLORD = "LANDLORD", "Landlord"
        AGENT = "AGENT", "Agent"
        ADMIN = "ADMIN", "Admin"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    username = models.CharField(
        max_length=150,
        unique=True
    )

    email = models.EmailField(
        unique=True
    )

    phone = models.CharField(
        max_length=20,
        unique=True,
        blank=True,
        null=True
    )

    role = models.CharField(
        max_length=20,
        choices=Roles.choices,
        default=Roles.TENANT
    )

    profile_photo = models.ImageField(
        upload_to="profiles/",
        blank=True,
        null=True,
    )

    county = models.CharField(
        max_length=100,
        blank=True,
    )

    bio = models.TextField(
        blank=True,
    )

    company_name = models.CharField(
        max_length=200,
        blank=True,
    )

    license_number = models.CharField(
        max_length=100,
        blank=True,
    )

    years_of_experience = models.PositiveIntegerField(
        default=0,
    )

    office_address = models.CharField(
        max_length=255,
        blank=True,
    )

    # Address where the user comes from / current residential address
    address = models.CharField(
        max_length=255,
        blank=True,
    )

    # Alternative email for contact
    alternative_email = models.EmailField(
        blank=True,
    )

    # National ID / identification number
    id_number = models.CharField(
        max_length=100,
        blank=True,
        unique=True,
        null=True,
    )

    # Date of birth
    dob = models.DateField(
        null=True,
        blank=True,
    )

    class Gender(models.TextChoices):
        MALE = "MALE", "Male"
        FEMALE = "FEMALE", "Female"
        OTHER = "OTHER", "Other"

    gender = models.CharField(
        max_length=10,
        choices=Gender.choices,
        blank=True,
    )

    occupation = models.CharField(
        max_length=150,
        blank=True,
    )

    alternate_phone = models.CharField(
        max_length=20,
        blank=True,
    )

    emergency_contact_name = models.CharField(
        max_length=150,
        blank=True,
    )

    emergency_contact_phone = models.CharField(
        max_length=20,
        blank=True,
    )

    referral_source = models.CharField(
        max_length=200,
        blank=True,
    )

    timezone = models.CharField(
        max_length=50,
        blank=True,
    )

    language = models.CharField(
        max_length=50,
        blank=True,
        default="en",
    )

    marketing_consent = models.BooleanField(
        default=False,
    )

    mpesa_number = models.CharField(
        max_length=20,
        blank=True,
    )

    website = models.URLField(
        blank=True,
    )

    whatsapp_number = models.CharField(
        max_length=20,
        blank=True,
    )

    facebook = models.URLField(
        blank=True,
    )

    instagram = models.URLField(
        blank=True,
    )

    linkedin = models.URLField(
        blank=True,
    )

    is_verified = models.BooleanField(
        default=False
    )

    email_verified = models.BooleanField(
        default=False
    )

    phone_verified = models.BooleanField(
        default=False
    )

    last_seen = models.DateTimeField(
        null=True,
        blank=True,
    )

    is_online = models.BooleanField(
        default=False,
    )

    USERNAME_FIELD = "email"

    REQUIRED_FIELDS = [
        "username",
    ]

    objects = UserManager()

    def __str__(self):
        return f"{self.email} ({self.role})"

class PasswordResetOTP(models.Model):

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="password_reset_otps",
    )

    otp = models.CharField(
        max_length=6
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    expires_at = models.DateTimeField()

    is_used = models.BooleanField(
        default=False
    )

    attempts = models.PositiveIntegerField(
        default=0
    )

    def is_valid(self):

        return (
            not self.is_used
            and timezone.now() < self.expires_at
            and self.attempts < 5
        )

    @classmethod
    def generate(cls, user):

        cls.objects.filter(
            user=user,
            is_used=False
        ).update(
            is_used=True
        )

        otp = f"{secrets.randbelow(1_000_000):06d}"

        return cls.objects.create(
            user=user,
            otp=otp,
            expires_at=timezone.now() + timedelta(minutes=10),
        )

    def __str__(self):

        return f"{self.user.email} - {self.otp}"

class PhoneOTP(models.Model):

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="phone_otps",
    )

    otp = models.CharField(
        max_length=6
    )

    expires_at = models.DateTimeField()

    is_used = models.BooleanField(
        default=False
    )

    attempts = models.PositiveIntegerField(
        default=0
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def is_expired(self):
        return timezone.now() > self.expires_at

    def __str__(self):
        return f"{self.user.email} - {self.otp}"

class EmailVerificationToken(models.Model):

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="email_verification_tokens",
    )

    token = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False,
    )

    expires_at = models.DateTimeField()

    is_used = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def is_expired(self):
        return timezone.now() > self.expires_at

    def __str__(self):
        return f"Email verification - {self.user.email}"

class UserVerification(models.Model):

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        UNDER_REVIEW = "UNDER_REVIEW", "Under Review"
        APPROVED = "APPROVED", "Approved"
        REJECTED = "REJECTED", "Rejected"

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="verification",
    )

    id_front = models.ImageField(
        upload_to="verification/id_front/",
        blank=True,
        null=True,
    )

    id_back = models.ImageField(
        upload_to="verification/id_back/",
        blank=True,
        null=True,
    )

    selfie = models.ImageField(
        upload_to="verification/selfie/",
        blank=True,
        null=True,
    )

    kra_pin = models.CharField(
        max_length=11,
        blank=True,
        null=True,
    )

    kra_verification_status = models.CharField(
        max_length=30,
        choices=[
            ("NOT_CHECKED", "Not Checked"),
            ("PENDING", "Pending"),
            ("VERIFIED", "Verified"),
            ("FAILED", "Failed"),
            ("MANUAL_REVIEW", "Manual Review"),
        ],
        default="NOT_CHECKED",
    )

    kra_obligation_status = models.CharField(
        max_length=30,
        choices=[
            ("NOT_CHECKED", "Not Checked"),
            ("FOUND", "Found"),
            ("NOT_FOUND", "Not Found"),
            ("UNKNOWN", "Unknown"),
            ("MANUAL_REVIEW", "Manual Review"),
        ],
        default="NOT_CHECKED",
    )

    kra_verification_message = models.TextField(
        blank=True,
    )

    kra_verified_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    kra_api_response = models.JSONField(
        null=True,
        blank=True,
    )

    business_certificate = models.FileField(
        upload_to="verification/business/",
        blank=True,
        null=True,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )

    rejection_reason = models.TextField(
        blank=True,
    )

    verified_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="verified_accounts",
    )

    verified_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    def __str__(self):
        return f"{self.user.email} - {self.status}"