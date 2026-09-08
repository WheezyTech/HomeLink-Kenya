from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from properties.api.serializers import PropertySerializer
from properties.models import Property

from ai.services.llm_search import AISmartSearchService


class AISmartSearchAPIView(APIView):

    permission_classes = [AllowAny]

    def get(self, request):

        query = request.query_params.get(
            "q",
            "",
        ).strip()

        if not query:
            return Response(
                {
                    "success": False,
                    "message": "Please provide a search query.",
                },
                status=400,
            )

        try:
            filters = AISmartSearchService.interpret(query)

        except Exception:
            return Response(
                {
                    "success": False,
                    "message": "Unable to understand the search request.",
                },
                status=400,
            )

        queryset = Property.objects.filter(
            status=Property.Status.APPROVED
        )

        if filters.get("county"):
            queryset = queryset.filter(
                county__icontains=filters["county"]
            )

        if filters.get("estate"):
            queryset = queryset.filter(
                estate__icontains=filters["estate"]
            )

        if filters.get("property_type"):
            queryset = queryset.filter(
                property_type=filters["property_type"]
            )

        if filters.get("purpose"):
            queryset = queryset.filter(
                purpose=filters["purpose"]
            )

        if filters.get("bedrooms") is not None:
            queryset = queryset.filter(
                bedrooms=filters["bedrooms"]
            )

        if filters.get("min_price") is not None:
            queryset = queryset.filter(
                price__gte=filters["min_price"]
            )

        if filters.get("max_price") is not None:
            queryset = queryset.filter(
                price__lte=filters["max_price"]
            )

        queryset = queryset.order_by(
            "-is_featured",
            "-created_at",
        )

        serializer = PropertySerializer(
            queryset,
            many=True,
            context={
                "request": request,
            },
        )

        return Response(
            {
                "success": True,
                "query": query,
                "filters": filters,
                "count": queryset.count(),
                "results": serializer.data,
            }
        )