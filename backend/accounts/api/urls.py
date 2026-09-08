from django.urls import path

from .views import (
    AdminVerificationListAPIView,
    RegisterAPIView,
    LoginAPIView,
    LogoutAPIView,
    ProfileAPIView,
    RentalPassportAPIView,
    ChangePasswordAPIView,
    ForgotPasswordAPIView,
    ReviewVerificationAPIView,
    UserVerificationAPIView,
    VerifyOTPAPIView,
    ResetPasswordAPIView,
    VerifyEmailAPIView,
    VerifyPhoneAPIView,
    ResendPhoneOTPAPIView,
    AgentViewSet,
    AgentProfileViewSet,
)

urlpatterns = [
    path("register/", RegisterAPIView.as_view(), name="register"),
    path("login/", LoginAPIView.as_view(), name="login"),
    path("logout/", LogoutAPIView.as_view(), name="logout"),
    path("profile/", ProfileAPIView.as_view(), name="profile"),
    path(
        "rental-passport/",
        RentalPassportAPIView.as_view(),
        name="rental-passport",
    ),
    path(
        "change-password/",
        ChangePasswordAPIView.as_view(),
    ),

    path(
        "forgot-password/",
        ForgotPasswordAPIView.as_view(),
        name="forgot-password",
    ),

    path(
        "verify-otp/",
        VerifyOTPAPIView.as_view(),
        name="verify-otp",
    ),

    path(
        "reset-password/",
        ResetPasswordAPIView.as_view(),
        name="reset-password",
    ),

    path(
        "verify-email/<uuid:token>/",
        VerifyEmailAPIView.as_view(),
        name="verify-email",
    ),

    path(
        "verify-phone/",
        VerifyPhoneAPIView.as_view(),
        name="verify-phone",
    ),
    path(
        "resend-phone-otp/",
        ResendPhoneOTPAPIView.as_view(),
        name="resend-phone-otp",
    ),
    path(
        "agents/",
        AgentViewSet.as_view({"get": "list"}),
        name="agents",
    ),
    path(
        "agents/<uuid:pk>/",
        AgentProfileViewSet.as_view({"get": "retrieve"}),
        name="agent-detail",
    ),

    path(
        "verification/",
        UserVerificationAPIView.as_view(),
        name="verification",
    ),

    path(
        "admin/verifications/",
        AdminVerificationListAPIView.as_view(),
    ),

    path(
        "admin/verifications/<uuid:pk>/",
        ReviewVerificationAPIView.as_view(),
    ),
]