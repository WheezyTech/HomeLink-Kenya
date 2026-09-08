from io import BytesIO

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas


def generate_rent_receipt(rent):
    buffer = BytesIO()

    pdf = canvas.Canvas(
        buffer,
        pagesize=A4,
    )

    width, height = A4

    # =========================
    # HEADER
    # =========================

    pdf.setFont(
        "Helvetica-Bold",
        20,
    )

    pdf.drawString(
        25 * mm,
        height - 30 * mm,
        "HomeLink Kenya",
    )

    pdf.setFont(
        "Helvetica",
        11,
    )

    pdf.drawString(
        25 * mm,
        height - 38 * mm,
        "RENT PAYMENT RECEIPT",
    )

    # =========================
    # RECEIPT INFORMATION
    # =========================

    y = height - 60 * mm

    pdf.setFont(
        "Helvetica-Bold",
        12,
    )

    pdf.drawString(
        25 * mm,
        y,
        "Receipt Information",
    )

    y -= 10 * mm

    receipt_number = (
        rent.mpesa_receipt_number
        or rent.payment_reference
        or str(rent.id)
    )

    information = [
        (
            "Receipt Number",
            receipt_number,
        ),
        (
            "Payment Reference",
            rent.payment_reference or "N/A",
        ),
        (
            "Payment Status",
            rent.get_status_display(),
        ),
        (
            "Payment Date",
            (
                rent.paid_at.strftime(
                    "%d %B %Y %H:%M"
                )
                if rent.paid_at
                else "N/A"
            ),
        ),
        (
            "M-Pesa Receipt",
            rent.mpesa_receipt_number or "N/A",
        ),
    ]

    for label, value in information:

        pdf.setFont(
            "Helvetica-Bold",
            9,
        )

        pdf.drawString(
            25 * mm,
            y,
            f"{label}:",
        )

        pdf.setFont(
            "Helvetica",
            9,
        )

        pdf.drawString(
            70 * mm,
            y,
            str(value),
        )

        y -= 7 * mm

    # =========================
    # RENTAL INFORMATION
    # =========================

    y -= 8 * mm

    pdf.setFont(
        "Helvetica-Bold",
        12,
    )

    pdf.drawString(
        25 * mm,
        y,
        "Rental Information",
    )

    y -= 10 * mm

    tenant_name = (
        rent.tenant.get_full_name()
        or rent.tenant.email
    )

    landlord_name = (
        rent.landlord.get_full_name()
        or rent.landlord.email
    )

    property_title = (
        rent.lease.property.title
    )

    rental_information = [
        (
            "Tenant",
            tenant_name,
        ),
        (
            "Landlord",
            landlord_name,
        ),
        (
            "Property",
            property_title,
        ),
        (
            "Lease ID",
            str(rent.lease.id),
        ),
        (
            "Due Date",
            rent.due_date.strftime(
                "%d %B %Y"
            ),
        ),
    ]

    for label, value in rental_information:

        pdf.setFont(
            "Helvetica-Bold",
            9,
        )

        pdf.drawString(
            25 * mm,
            y,
            f"{label}:",
        )

        pdf.setFont(
            "Helvetica",
            9,
        )

        pdf.drawString(
            70 * mm,
            y,
            str(value),
        )

        y -= 7 * mm

    # =========================
    # PAYMENT SUMMARY
    # =========================

    y -= 8 * mm

    pdf.setFont(
        "Helvetica-Bold",
        12,
    )

    pdf.drawString(
        25 * mm,
        y,
        "Payment Summary",
    )

    y -= 10 * mm

    pdf.setFont(
        "Helvetica",
        10,
    )

    pdf.drawString(
        25 * mm,
        y,
        "Amount Due:",
    )

    pdf.drawString(
        70 * mm,
        y,
        f"KSh {rent.amount_due:,.2f}",
    )

    y -= 8 * mm

    pdf.drawString(
        25 * mm,
        y,
        "Amount Paid:",
    )

    pdf.drawString(
        70 * mm,
        y,
        f"KSh {rent.amount_paid:,.2f}",
    )

    y -= 8 * mm

    remaining = max(
        rent.amount_due - rent.amount_paid,
        0,
    )

    pdf.drawString(
        25 * mm,
        y,
        "Remaining Balance:",
    )

    pdf.drawString(
        70 * mm,
        y,
        f"KSh {remaining:,.2f}",
    )

    # =========================
    # FOOTER
    # =========================

    pdf.setFont(
        "Helvetica",
        9,
    )

    pdf.drawString(
        25 * mm,
        25 * mm,
        "Thank you for using HomeLink Kenya.",
    )

    pdf.drawString(
        25 * mm,
        19 * mm,
        "This receipt was generated electronically.",
    )

    pdf.save()

    buffer.seek(0)

    return buffer