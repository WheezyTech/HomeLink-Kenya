import re


def normalize_kenyan_phone(phone):

    if not phone:
        return None

    phone = re.sub(r"[\s\-()]", "", str(phone))

    # +254712345678
    if phone.startswith("+254"):
        phone = phone[1:]

    # 0712345678
    if phone.startswith("07") and len(phone) == 10:
        phone = "254" + phone[1:]

    # 0112345678
    elif phone.startswith("01") and len(phone) == 10:
        phone = "254" + phone[1:]

    # Already international format
    elif phone.startswith("254"):
        pass

    else:
        return None

    # Must be exactly 12 digits
    if not re.fullmatch(r"254\d{9}", phone):
        return None

    # Kenyan mobile numbers:
    # 254 7XX XXX XXX
    # 254 1XX XXX XXX
    if not (
        phone.startswith("2547")
        or phone.startswith("2541")
    ):
        return None

    return phone