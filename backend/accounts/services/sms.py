import africastalking

from django.conf import settings


def send_otp_sms(phone, otp):

    if not phone:
        return False

    try:
        africastalking.initialize(
            settings.AFRICASTALKING_USERNAME,
            settings.AFRICASTALKING_API_KEY,
        )
    except Exception as error:
        print("SMS initialization error:", error)
        return False

    sms = africastalking.SMS

    message = (
        f"HomeLink Kenya: Your verification OTP is "
        f"{otp}. It expires in 10 minutes."
    )

    try:
        response = sms.send(
            message,
            [phone],
            sender_id=settings.AFRICASTALKING_SENDER_ID,
        )

        print("SMS response:", response)

        return True

    except Exception as error:
        print("SMS sending error:", error)
        return False