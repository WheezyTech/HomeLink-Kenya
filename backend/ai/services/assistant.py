from django.conf import settings
from openai import OpenAI

from properties.models import Property


class AIAssistantService:

    @staticmethod
    def answer(user_message):

        properties = Property.objects.filter(
            status=Property.Status.APPROVED
        ).select_related(
            "owner",
        ).order_by(
            "-is_featured",
            "-created_at",
        )[:30]

        property_context = []

        for property in properties:
            property_context.append(
                {
                    "id": str(property.id),
                    "title": property.title,
                    "county": property.county,
                    "estate": property.estate,
                    "property_type": property.property_type,
                    "purpose": property.purpose,
                    "price": str(property.price),
                    "bedrooms": property.bedrooms,
                    "bathrooms": property.bathrooms,
                    "description": property.description,
                }
            )

        client = OpenAI(
            api_key=settings.OPENAI_API_KEY
        )

        prompt = f"""
You are HomeLink Kenya's property assistant.

Answer the user's property question using ONLY
the property information supplied below.

Do not invent properties, prices, locations,
owners, or availability.

If there are no suitable properties, say so.

Property data:
{property_context}

User:
{user_message}
"""

        response = client.responses.create(
            model="gpt-5-mini",
            input=prompt,
        )

        return response.output_text