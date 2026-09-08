from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from common.utils import api_response

from dashboard.api.serializers import DashboardSerializer
from dashboard.services.dashboard import DashboardService


class DashboardAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        dashboard_data = DashboardService.get_dashboard(user)
        serializer = DashboardSerializer(dashboard_data)

        return api_response(
            True,
            "Dashboard loaded successfully.",
            serializer.data,
        )