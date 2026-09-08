from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from ai.services.parser import PropertySearchParser
from ai.services.recommendation import RecommendationService


class RecommendationAPIView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        message = request.data.get(
            "message",
            ""
        ).strip()

        if not message:

            return Response(
                {
                    "success": False,
                    "message": "Please enter a property request.",
                },
                status=400,
            )

        filters = PropertySearchParser.parse(
            message
        )

        properties = RecommendationService.search_properties(
            **filters
        )

        results = []

        for property in properties:

            cover_image = property.images.filter(
                is_cover=True
            ).first()

            if not cover_image:
                cover_image = property.images.first()

            image_url = None

            if cover_image and cover_image.image:

                image_url = request.build_absolute_uri(
                    cover_image.image.url
                )

            results.append(
                {
                    "id": str(property.id),
                    "title": property.title,
                    "description": property.description,
                    "price": str(property.price),
                    "county": property.county,
                    "estate": property.estate,
                    "bedrooms": property.bedrooms,
                    "bathrooms": property.bathrooms,
                    "property_type": property.property_type,
                    "purpose": property.purpose,
                    "cover_image": image_url,
                    "is_featured": property.is_featured,
                    "is_verified": property.is_verified,
                }
            )

        return Response(
            {
                "success": True,
                "message": message,
                "filters": filters,
                "answer": (
                    f"I found {len(results)} "
                    f"matching properties."
                ),
                "properties": results,
            }
        )