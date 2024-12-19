from twilio.rest import Client
from django.conf import settings

def send_otp(phone_number, otp):
    try:
        # Initialize Twilio client with Account SID and Auth Token
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)

        # Construct the OTP message
        message = f"Your one-time password (OTP) is: {otp}"

        # Send SMS via Twilio
        client.messages.create(
            to=phone_number,
            from_=settings.TWILIO_PHONE_NUMBER,
            body=message
        )
        return True
    except Exception as e:
        print(f"Error sending OTP: {e}")
        return False
