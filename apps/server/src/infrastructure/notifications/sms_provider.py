import requests
from src.utils.env import get_env_var

class SmsProvider:
    def __init__(self):
        self.api_key = get_env_var("VONAGE_API_KEY")
        self.api_secret = get_env_var("VONAGE_API_SECRET")
        self.from_number = get_env_var("SMS_FROM_NUMBER")
        
    async def send_post_notification(self, phone_number: str, user_name: str, post_url: str) -> dict:
        """Send SMS notification about new post"""
        message = f"Hello {user_name}! You have a new shared memory to view: {post_url}"
        
        # Mocking SMS sending for this example
        print(f"Sending SMS to {phone_number}: {message}")
        return {"status": "success", "to": phone_number, "message": message}
        # In a real implementation, you would uncomment and use the following code:
        # response = requests.post(
        #     'https://rest.nexmo.com/sms/json',
        #     data={
        #         'api_key': self.api_key,
        #         'api_secret': self.api_secret,
        #         'to': phone_number,
        #         'from': self.from_number,
        #         'text': message
        #     }
        # )
        # return response.json()