from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from ai.services.recommendation import (
    AIRecommendationService,
)

from properties.api.serializers import PropertySerializer


class AIRecommendationAPIView(APIView):

    permission_classes = [AllowAny]

    def get(self, request):

        properties = AIRecommendationService.recommend(
            user=request.user,
            county=request.query_params.get("county"),
            estate=request.query_params.get("estate"),
            property_type=request.query_params.get(
                "property_type"
            ),
            purpose=request.query_params.get(
                "purpose"
            ),
            bedrooms=request.query_params.get(
                "bedrooms"
            ),
            min_price=request.query_params.get(
                "min_price"
            ),
            max_price=request.query_params.get(
                "max_price"
            ),
        )

        serializer = PropertySerializer(
            properties,
            many=True,
            context={
                "request": request,
            },
        )

        return Response({
            "success": True,
            "count": len(properties),
            "results": serializer.data,
        })