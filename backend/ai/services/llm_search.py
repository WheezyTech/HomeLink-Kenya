import json

from django.conf import settings
from openai import OpenAI


class AISmartSearchService:

    @staticmethod
    def interpret(query):

        client = OpenAI(
            api_key=settings.OPENAI_API_KEY
        )

        response = client.responses.create(
            model="gpt-5-mini",
            input=[
                {
                    "role": "system",
                    "content": (
                        "You are a real estate search assistant. "
                        "Convert the user's property search request "
                        "into JSON filters. "
                        "Return JSON only."
                    ),
                },
                {
                    "role": "user",
                    "content": query,
                },
            ],
        )

        text = response.output_text

        return json.loads(text)