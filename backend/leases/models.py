import uuid

from django.conf import settings
from django.db import models

from properties.models import Property


class Lease(models.Model):

    class Status(models.TextChoices):
        DRAFT = "DRAFT", "Draft"
        ACTIVE = "ACTIVE", "Active"
        EXPIRED = "EXPIRED", "Expired"
        TERMINATED = "TERMINATED", "Terminated"
        REJECTED = "REJECTED", "Rejected"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name="leases",
    )

    landlord = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="landlord_leases",
    )

    tenant = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="tenant_leases",
    )

    monthly_rent = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    security_deposit = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    start_date = models.DateField()

    end_date = models.DateField()

    lease_document = models.FileField(
        upload_to="leases/",
        blank=True,
        null=True,
    )

    agreement_status = models.CharField(
        max_length=20,
        choices=[
            ("PENDING", "Pending Signatures"),
            ("PARTIALLY_SIGNED", "Partially Signed"),
            ("SIGNED", "Fully Signed"),
        ],
        default="PENDING",
    )

    landlord_signed = models.BooleanField(
        default=False,
    )

    tenant_signed = models.BooleanField(
        default=False,
    )

    landlord_signed_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    tenant_signed_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    agreement_signed_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    verification_id = models.UUIDField(
        default=None,
        null=True,
        blank=True,
        unique=True,
        editable=False,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def generate_signed_document(self):
        if self.lease_document:
            return self.lease_document

        if self.agreement_status != "SIGNED" and not (
            self.landlord_signed and self.tenant_signed
        ):
            return self.lease_document

        from leases.services.pdf_service import generate_lease_pdf

        pdf_file = generate_lease_pdf(self)

        self.lease_document.save(
            pdf_file.name,
            pdf_file,
        )
        self.save(update_fields=["lease_document", "updated_at"])

        return self.lease_document

    def __str__(self):
        return f"{self.property.title} - {self.tenant}"