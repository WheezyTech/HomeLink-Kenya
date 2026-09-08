import uuid

from django.conf import settings
from django.db import models


class Property(models.Model):

    class PropertyType(models.TextChoices):

        # Residential
        SINGLE_ROOM = "SINGLE_ROOM", "Single Room"
        BEDSITTER = "BEDSITTER", "Bedsitter"
        STUDIO = "STUDIO", "Studio Apartment"
        ONE_BEDROOM = "ONE_BEDROOM", "One Bedroom"
        TWO_BEDROOM = "TWO_BEDROOM", "Two Bedroom"
        THREE_BEDROOM = "THREE_BEDROOM", "Three Bedroom"
        FOUR_BEDROOM = "FOUR_BEDROOM", "Four Bedroom"
        APARTMENT = "APARTMENT", "Apartment"
        MAISONETTE = "MAISONETTE", "Maisonette"
        BUNGALOW = "BUNGALOW", "Bungalow"
        VILLA = "VILLA", "Villa"

        # Commercial
        SHOP = "SHOP", "Shop"
        OFFICE = "OFFICE", "Office"
        WAREHOUSE = "WAREHOUSE", "Warehouse"
        GODOWN = "GODOWN", "Godown"
        HOTEL = "HOTEL", "Hotel"
        LODGE = "LODGE", "Lodge"
        RESTAURANT = "RESTAURANT", "Restaurant"
        INDUSTRIAL = "INDUSTRIAL", "Industrial Building"

        # Land
        LAND = "LAND", "Land"
        RESIDENTIAL_PLOT = "RESIDENTIAL_PLOT", "Residential Plot"
        COMMERCIAL_PLOT = "COMMERCIAL_PLOT", "Commercial Plot"
        AGRICULTURAL_LAND = "AGRICULTURAL_LAND", "Agricultural Land"

        # Institutional
        SCHOOL = "SCHOOL", "School"
        COLLEGE = "COLLEGE", "College"
        UNIVERSITY = "UNIVERSITY", "University"
        HOSPITAL = "HOSPITAL", "Hospital"
        CLINIC = "CLINIC", "Clinic"
        CHURCH = "CHURCH", "Church"
        MOSQUE = "MOSQUE", "Mosque"

    class Purpose(models.TextChoices):
        RENT = "RENT", "For Rent"
        SALE = "SALE", "For Sale"

    class Furnishing(models.TextChoices):
        FURNISHED = "FURNISHED", "Furnished"
        SEMI_FURNISHED = "SEMI_FURNISHED", "Semi Furnished"
        UNFURNISHED = "UNFURNISHED", "Unfurnished"

    class Status(models.TextChoices):
        DRAFT = "DRAFT", "Draft"
        PENDING = "PENDING", "Pending Approval"
        APPROVED = "APPROVED", "Approved"
        REJECTED = "REJECTED", "Rejected"
        RENTED = "RENTED", "Rented"
        ARCHIVED = "ARCHIVED", "Archived"
    class Availability(models.TextChoices):
        AVAILABLE = "AVAILABLE", "Available"
        RESERVED = "RESERVED", "Reserved"
        SOLD = "SOLD", "Sold"
        RENTED = "RENTED", "Rented"

    class Category(models.TextChoices):
        RESIDENTIAL = "RESIDENTIAL", "Residential"
        COMMERCIAL = "COMMERCIAL", "Commercial"
        INSTITUTIONAL = "INSTITUTIONAL", "Institutional"
        LAND = "LAND", "Land"
        
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="properties",
    )

    title = models.CharField(max_length=200)

    description = models.TextField()

    property_type = models.CharField(
        max_length=30,
        choices=PropertyType.choices,
    )
    furnishing = models.CharField(
        max_length=20,
        choices=Furnishing.choices,
        blank=True,
    )

    availability = models.CharField(
        max_length=20,
        choices=Availability.choices,
        default=Availability.AVAILABLE,
    )

    agent = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="managed_properties",
    )

    category = models.CharField(
        max_length=20,
        choices=Category.choices,
        default=Category.RESIDENTIAL,
    )
    
    price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    county = models.CharField(max_length=100)

    estate = models.CharField(max_length=100)

    bedrooms = models.PositiveIntegerField(default=0)

    bathrooms = models.PositiveIntegerField(default=0)

    latitude = models.DecimalField(
        max_digits=10,
        decimal_places=7,
        null=True,
        blank=True,
    )

    longitude = models.DecimalField(
        max_digits=10,
        decimal_places=7,
        null=True,
        blank=True,
    )

    location_verified = models.BooleanField(
        default=False,
    )

    google_maps_url = models.URLField(
        blank=True,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )

    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="approved_properties",
    )

    approved_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    purpose = models.CharField(
        max_length=10,
        choices=Purpose.choices,
        default=Purpose.RENT,
    )

    rejection_reason = models.TextField(
        blank=True,
    )

    is_featured = models.BooleanField(
        default=False,
    )

    featured_until = models.DateTimeField(
        null=True,
        blank=True,
    )

    is_verified = models.BooleanField(default=False)
    
    verification_notes = models.TextField(
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class PropertyImage(models.Model):
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name="images",
    )

    image = models.ImageField(
        upload_to="properties/"
    )

    is_cover = models.BooleanField(
        default=False
    )

    uploaded_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.property.title} Image"