import uuid

from django.conf import settings
from django.db import models


class ServiceCategory(models.Model):

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    name = models.CharField(
        max_length=100,
        unique=True,
    )

    slug = models.SlugField(
        max_length=120,
        unique=True,
    )

    description = models.TextField(
        blank=True,
    )

    icon = models.CharField(
        max_length=100,
        blank=True,
    )

    is_active = models.BooleanField(
        default=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class ServiceProvider(models.Model):

    class ProviderType(models.TextChoices):
        INDIVIDUAL = "INDIVIDUAL", "Individual"
        COMPANY = "COMPANY", "Company"

    class VerificationStatus(models.TextChoices):
        PENDING = "PENDING", "Pending"
        VERIFIED = "VERIFIED", "Verified"
        REJECTED = "REJECTED", "Rejected"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="service_provider",
    )

    provider_type = models.CharField(
        max_length=20,
        choices=ProviderType.choices,
        default=ProviderType.INDIVIDUAL,
    )

    business_name = models.CharField(
        max_length=200,
    )

    description = models.TextField(
        blank=True,
    )

    phone = models.CharField(
        max_length=20,
    )

    email = models.EmailField(
        blank=True,
    )

    county = models.CharField(
        max_length=100,
    )

    town = models.CharField(
        max_length=100,
        blank=True,
    )

    estate = models.CharField(
        max_length=100,
        blank=True,
    )

    years_experience = models.PositiveIntegerField(
        default=0,
    )

    starting_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
    )

    profile_image = models.ImageField(
        upload_to="service_providers/",
        null=True,
        blank=True,
    )

    verification_status = models.CharField(
        max_length=20,
        choices=VerificationStatus.choices,
        default=VerificationStatus.PENDING,
    )

    is_active = models.BooleanField(
        default=True,
    )

    rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0,
    )

    completed_jobs = models.PositiveIntegerField(
        default=0,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["-rating", "-completed_jobs"]

    def __str__(self):
        return self.business_name

class ServiceListing(models.Model):

    class PricingType(models.TextChoices):
        FIXED = "FIXED", "Fixed Price"
        STARTING_FROM = "STARTING_FROM", "Starting From"
        HOURLY = "HOURLY", "Hourly"
        QUOTE = "QUOTE", "Request Quote"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    provider = models.ForeignKey(
        ServiceProvider,
        on_delete=models.CASCADE,
        related_name="listings",
    )

    category = models.ForeignKey(
        ServiceCategory,
        on_delete=models.PROTECT,
        related_name="listings",
    )

    title = models.CharField(
        max_length=200,
    )

    description = models.TextField()

    pricing_type = models.CharField(
        max_length=20,
        choices=PricingType.choices,
        default=PricingType.STARTING_FROM,
    )

    price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
    )

    duration_hours = models.PositiveIntegerField(
        null=True,
        blank=True,
    )

    service_area = models.CharField(
        max_length=255,
        blank=True,
    )

    is_available = models.BooleanField(
        default=True,
    )

    is_featured = models.BooleanField(
        default=False,
    )

    views = models.PositiveIntegerField(
        default=0,
    )

    completed_jobs = models.PositiveIntegerField(
        default=0,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = [
            "-is_featured",
            "-created_at",
        ]

    def __str__(self):
        return self.title

class ServiceListingImage(models.Model):

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    listing = models.ForeignKey(
        ServiceListing,
        on_delete=models.CASCADE,
        related_name="images",
    )

    image = models.ImageField(
        upload_to="service_listings/",
    )

    is_cover = models.BooleanField(
        default=False,
    )

    uploaded_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        ordering = [
            "-is_cover",
            "-uploaded_at",
        ]

    def __str__(self):
        return f"{self.listing.title} image"

class ServiceRequest(models.Model):

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        ACCEPTED = "ACCEPTED", "Accepted"
        REJECTED = "REJECTED", "Rejected"
        CANCELLED = "CANCELLED", "Cancelled"
        IN_PROGRESS = "IN_PROGRESS", "In Progress"
        COMPLETED = "COMPLETED", "Completed"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="service_requests",
    )

    listing = models.ForeignKey(
        ServiceListing,
        on_delete=models.PROTECT,
        related_name="requests",
    )

    provider = models.ForeignKey(
        ServiceProvider,
        on_delete=models.PROTECT,
        related_name="service_requests",
    )

    property = models.ForeignKey(
        "properties.Property",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="maintenance_requests",
    )

    lease = models.ForeignKey(
        "leases.Lease",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="maintenance_requests",
    )

    description = models.TextField(
        blank=True,
    )

    service_location = models.CharField(
        max_length=255,
    )

    county = models.CharField(
        max_length=100,
    )

    preferred_date = models.DateField()

    preferred_time = models.TimeField(
        null=True,
        blank=True,
    )

    budget = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
    )

    customer_phone = models.CharField(
        max_length=20,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )

    provider_notes = models.TextField(
        blank=True,
    )

    rejection_reason = models.TextField(
        blank=True,
    )

    completed_at = models.DateTimeField(
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
        ordering = ["-created_at"]

    def __str__(self):
        return (
            f"{self.customer.email} - "
            f"{self.listing.title}"
        )