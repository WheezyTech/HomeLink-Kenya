from decimal import Decimal, InvalidOperation

from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from ai.services.recommendation import AIRecommendationService
from properties.api.serializers import PropertySerializer


class SmartAIAssistantAPIView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        message = request.data.get("message", "").strip()

        if not message:
            return Response(
                {
                    "success": False,
                    "message": "Please enter a message.",
                },
                status=400,
            )

        # Temporary simple filter extraction.
        # We will replace this with AI-powered extraction later.
        text = message.lower()

        bedrooms = None
        max_price = None
        min_price = None

        # Bedrooms
        import re

        bedroom_match = re.search(
            r"(\d+)\s*(?:bedroom|bedrooms|br)",
            text,
        )

        if bedroom_match:
            bedrooms = int(
                bedroom_match.group(1)
            )

        # Maximum price
        price_match = re.search(
            r"(?:under|below|less than|max|maximum)\s*(?:ksh|kes)?\s*([\d,]+)",
            text,
        )

        if price_match:

            try:
                max_price = Decimal(
                    price_match.group(1).replace(",", "")
                )

            except InvalidOperation:
                max_price = None

        properties = AIRecommendationService.search_properties(
            bedrooms=bedrooms,
            max_price=max_price,
        )

        serializer = PropertySerializer(
            properties,
            many=True,
            context={
                "request": request,
            },
        )

        if properties:

            if bedrooms and max_price:

                answer = (
                    f"I found {len(properties)} "
                    f"{bedrooms}-bedroom properties "
                    f"under KSh {max_price:,.0f}."
                )

            elif bedrooms:

                answer = (
                    f"I found {len(properties)} "
                    f"{bedrooms}-bedroom properties "
                    "that may match your request."
                )

            else:

                answer = (
                    f"I found {len(properties)} "
                    "properties that may match your request."
                )

        else:

            answer = (
                "I couldn't find properties matching "
                "your current search. Try changing the "
                "location, price, or number of bedrooms."
            )

        return Response(
            {
                "success": True,
                "answer": answer,
                "filters": {
                    "bedrooms": bedrooms,
                    "min_price": min_price,
                    "max_price": max_price,
                },
                "count": len(properties),
                "properties": serializer.data,
            }
        )