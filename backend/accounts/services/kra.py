import re
from dataclasses import dataclass
from typing import Any

class KRAService:

    @staticmethod
    def validate_pin_format(pin):
        """
        Validate the basic KRA PIN format.

        This does NOT prove that the PIN exists at KRA.
        Actual verification will happen through the official
        KRA integration once the API credentials/endpoints are available.
        """

        if not pin:
            return False

        pin = pin.strip().upper()

        pattern = r"^[AP]\d{9}[A-Z]$"

        return bool(re.match(pattern, pin))

    @classmethod
    def verify_pin(cls, pin):
        """
        KRA integration adapter.

        This currently performs only local format validation.
        It must NOT claim that the PIN is verified by KRA.
        """

        pin = pin.strip().upper()

        if not cls.validate_pin_format(pin):
            return {
                "success": False,
                "kra_status": "FAILED",
                "obligation_status": "UNKNOWN",
                "message": (
                    "Invalid KRA PIN format."
                ),
                "data": None,
            }

        return {
            "success": False,
            "kra_status": "MANUAL_REVIEW",
            "obligation_status": "UNKNOWN",
            "message": (
                "KRA verification service is not configured. "
                "Manual verification is required."
            ),
            "data": None,
        }

@dataclass
class KRAResult:
    verification_status: str
    obligation_status: str
    message: str
    obligations: list[dict[str, Any]]
    checked: bool = False


class KRAService:
    """
    KRA integration service.

    IMPORTANT:
    This does NOT pretend to contact KRA until an official
    KRA API endpoint and credentials are configured.
    """

    PIN_PATTERN = re.compile(r"^[AP]\d{9}[A-Z]$")

    @classmethod
    def verify_pin(cls, kra_pin: str) -> KRAResult:
        kra_pin = (kra_pin or "").strip().upper()

        # Basic local validation only.
        if not kra_pin:
            return KRAResult(
                verification_status="MANUAL_REVIEW",
                obligation_status="UNKNOWN",
                message="KRA PIN was not provided.",
                obligations=[],
                checked=False,
            )

        if not cls.PIN_PATTERN.match(kra_pin):
            return KRAResult(
                verification_status="FAILED",
                obligation_status="UNKNOWN",
                message="The KRA PIN format is invalid.",
                obligations=[],
                checked=False,
            )

        # We do NOT claim that the PIN exists at KRA.
        # Actual verification will be added once official
        # KRA API access is available.
        return KRAResult(
            verification_status="MANUAL_REVIEW",
            obligation_status="UNKNOWN",
            message=(
                "KRA PIN format is valid, but automatic KRA verification "
                "is not currently configured. Admin manual review is required."
            ),
            obligations=[],
            checked=False,
        )