from django.urls import path

from .assistant import AIAssistantAPIView
from .search import AISmartSearchAPIView
from .views import RecommendationAPIView
from .smart_assistant import SmartAIAssistantAPIView


urlpatterns = [

    path(
        "assistant/",
        AIAssistantAPIView.as_view(),
        name="ai-assistant",
    ),

    path(
        "search/",
        AISmartSearchAPIView.as_view(),
        name="ai-search",
    ),

    path(
        "recommendations/",
        RecommendationAPIView.as_view(),
        name="ai-recommendations",
    ),

    path(
        "smart-assistant/",
        SmartAIAssistantAPIView.as_view(),
        name="smart-ai-assistant",
    ),
]