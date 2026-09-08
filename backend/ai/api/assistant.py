from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from ai.services.assistant import AIAssistantService


class AIAssistantAPIView(APIView):

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
                    "message": "Please enter a message.",
                },
                status=400,
            )

        try:

            answer = AIAssistantService.answer(
                message
            )

            return Response(
                {
                    "success": True,
                    "message": message,
                    "answer": answer,
                }
            )

        except Exception as e:

            return Response(
                {
                    "success": False,
                    "message": str(e),
                },
                status=500,
            )