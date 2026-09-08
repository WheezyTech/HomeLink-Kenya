from io import BytesIO

from django.core.files.base import ContentFile
from django.utils import timezone

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

from leases.models import Lease


def generate_lease_pdf(lease):
    buffer = BytesIO()

    document = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=20 * mm,
        leftMargin=20 * mm,
        topMargin=20 * mm,
        bottomMargin=20 * mm,
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "LeaseTitle",
        parent=styles["Title"],
        alignment=TA_CENTER,
        fontSize=18,
        spaceAfter=15,
    )

    heading_style = ParagraphStyle(
        "LeaseHeading",
        parent=styles["Heading2"],
        fontSize=12,
        spaceBefore=12,
        spaceAfter=8,
    )

    normal_style = ParagraphStyle(
        "LeaseNormal",
        parent=styles["Normal"],
        fontSize=10,
        leading=15,
    )

    story = []

    story.append(
        Paragraph(
            "RESIDENTIAL LEASE AGREEMENT",
            title_style,
        )
    )

    story.append(
        Paragraph(
            f"Agreement Verification ID: "
            f"{lease.verification_id}",
            normal_style,
        )
    )

    story.append(Spacer(1, 10))

    # Parties

    story.append(
        Paragraph(
            "1. PARTIES",
            heading_style,
        )
    )

    landlord_name = (
        getattr(lease.landlord, "get_full_name", lambda: "")()
        or getattr(lease.landlord, "email", "Landlord")
    )

    tenant_name = (
        getattr(lease.tenant, "get_full_name", lambda: "")()
        or getattr(lease.tenant, "email", "Tenant")
    )

    story.append(
        Paragraph(
            f"This Lease Agreement is entered into between "
            f"<b>{landlord_name}</b> (Landlord) and "
            f"<b>{tenant_name}</b> (Tenant).",
            normal_style,
        )
    )

    # Property

    story.append(
        Paragraph(
            "2. PROPERTY",
            heading_style,
        )
    )

    story.append(
        Paragraph(
            f"The leased property is "
            f"<b>{lease.property.title}</b>, located in "
            f"{lease.property.estate}, "
            f"{lease.property.county}.",
            normal_style,
        )
    )

    # Financial terms

    story.append(
        Paragraph(
            "3. RENT AND SECURITY DEPOSIT",
            heading_style,
        )
    )

    financial_data = [
        ["Monthly Rent", f"KSh {lease.monthly_rent:,.2f}"],
        [
            "Security Deposit",
            f"KSh {lease.security_deposit:,.2f}",
        ],
    ]

    table = Table(
        financial_data,
        colWidths=[70 * mm, 80 * mm],
    )

    table.setStyle(
        TableStyle(
            [
                ("GRID", (0, 0), (-1, -1), 0.5, "grey"),
                ("BACKGROUND", (0, 0), (0, -1), "#eeeeee"),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("PADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )

    story.append(table)

    # Term

    story.append(
        Paragraph(
            "4. LEASE TERM",
            heading_style,
        )
    )

    story.append(
        Paragraph(
            f"The lease begins on "
            f"<b>{lease.start_date}</b> and ends on "
            f"<b>{lease.end_date}</b>.",
            normal_style,
        )
    )

    # Agreement

    story.append(
        Paragraph(
            "5. AGREEMENT",
            heading_style,
        )
    )

    story.append(
        Paragraph(
            "The parties agree to comply with the terms "
            "and conditions of this lease and all applicable "
            "laws governing the tenancy.",
            normal_style,
        )
    )

    # Electronic signatures

    story.append(
        Paragraph(
            "6. ELECTRONIC SIGNATURES",
            heading_style,
        )
    )

    story.append(
        Paragraph(
            "The parties acknowledge that their electronic "
            "signatures recorded through the HomeLink Kenya "
            "platform represent their acceptance of this "
            "Lease Agreement.",
            normal_style,
        )
    )

    story.append(Spacer(1, 15))

    signature_data = [
        [
            "LANDLORD",
            "TENANT",
        ],
        [
            landlord_name,
            tenant_name,
        ],
        [
            (
                "SIGNED"
                if lease.landlord_signed
                else "NOT SIGNED"
            ),
            (
                "SIGNED"
                if lease.tenant_signed
                else "NOT SIGNED"
            ),
        ],
        [
            (
                str(lease.landlord_signed_at)
                if lease.landlord_signed_at
                else "—"
            ),
            (
                str(lease.tenant_signed_at)
                if lease.tenant_signed_at
                else "—"
            ),
        ],
    ]

    signature_table = Table(
        signature_data,
        colWidths=[75 * mm, 75 * mm],
    )

    signature_table.setStyle(
        TableStyle(
            [
                ("GRID", (0, 0), (-1, -1), 0.5, "grey"),
                ("BACKGROUND", (0, 0), (-1, 0), "#eeeeee"),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("PADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )

    story.append(signature_table)

    story.append(Spacer(1, 15))

    story.append(
        Paragraph(
            f"Agreement status: "
            f"<b>{lease.agreement_status}</b>",
            normal_style,
        )
    )

    if lease.agreement_signed_at:
        story.append(
            Paragraph(
                f"Fully signed on: "
                f"{lease.agreement_signed_at}",
                normal_style,
            )
        )

    story.append(
        Paragraph(
            f"Verification ID: "
            f"{lease.verification_id}",
            normal_style,
        )
    )

    document.build(story)

    buffer.seek(0)

    return ContentFile(
        buffer.getvalue(),
        name=f"lease-{lease.id}.pdf",
    )