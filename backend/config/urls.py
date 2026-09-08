from django.contrib import admin
from django.urls import include, path

from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)

urlpatterns = [
    path("admin/", admin.site.urls),

    path(
        "api/auth/",
        include("accounts.api.urls"),
    ),
    path("api/properties/", include("properties.api.urls")),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema")),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema")),
    path(
        "api/subscriptions/",
        include("subscriptions.api.urls")
    ),
    path(
        "api/favourites/",
        include("favourites.api.urls")
    ),
    path(
        "api/history/",
        include("history.api.urls")
    ),
    path(
        "api/bookings/",
        include("bookings.api.urls")
    ),
    path(
        "api/chat/",
        include("chat.api.urls")
    ),
    path(
        "api/notifications/",
        include("notifications.api.urls"),
    ),
    path(
        "api/payments/",
        include("payments.api.urls")
    ),
    path(
        "api/reports/",
        include("reports.api.urls")
    ),
    path(
        "api/dashboard/",
        include("dashboard.api.urls")
    ),
    path(
        "api/leases/",
        include("leases.api.urls"),
    ),
    path(
        "api/applications/",
        include("applications.api.urls"),
    ),

    path(
        "api/ai/",
        include("ai.api.urls"),
    ),

    path(
        "api/services/",
        include("services.api.urls"),
    ),

    path(
        "api/reviews/",
        include("reviews.urls"),
    ),

    path(
        "api/smart-map/",
        include("smart_map.urls"),
    ),

    path(
        "api/alerts/",
        include("alerts.urls"),
    ),

    path(
        "api/property-map/",
        include("property_map.urls"),
    ),

    path(
        "api/rent-payments/",
        include("rent_payments.urls"),
    ),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )