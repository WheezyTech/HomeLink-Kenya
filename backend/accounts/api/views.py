from django.contrib.auth import login, logout
from django.db import IntegrityError
from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
import logging

logger = logging.getLogger(__name__)
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser
from accounts.models import UserVerification
from applications.models import RentalApplication
from leases.models import Lease
from rent_payments.models import RentPayment
from .serializers import UserVerificationSerializer

from .serializers import AgentProfileSerializer
from accounts.models import (
    User,
    EmailVerificationToken,
    PhoneOTP,
)

from common.utils import api_response
from accounts.services.verification import create_phone_otp
from accounts.services.phone import normalize_kenyan_phone
from subscriptions.services import SubscriptionService
from .serializers import (
    ChangePasswordSerializer,
    ForgotPasswordSerializer,
    LoginSerializer,
    ProfileSerializer,
    RegisterSerializer,
    ResetPasswordSerializer,
    VerifyOTPSerializer,
    AgentSerializer,
)
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import update_session_auth_hash
from django.core.mail import send_mail
from django.utils import timezone
from accounts.models import PasswordResetOTP, User
from accounts.services.verification import (
    create_email_verification,
    create_phone_otp,
    account_is_verified,
)
from rest_framework.permissions import IsAdminUser

class RegisterAPIView(APIView):
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):

        serializer = RegisterSerializer(
            data=request.data
        )

        # Ensure required files are present for LANDLORD/AGENT
        role = request.data.get("role")
        missing_files = []

        if role in ("LANDLORD", "AGENT"):
            if role == "LANDLORD":
                required_files = ["kra_pin", "id_front", "id_back", "selfie"]
            else:
                required_files = ["business_certificate", "kra_pin"]

            for f in required_files:
                if f not in request.FILES:
                    missing_files.append(f)

            if missing_files:
                return api_response(
                    False,
                    "Missing required files for registration.",
                    {"missing_files": missing_files},
                    400,
                )

        if not serializer.is_valid():
            # Log payload and validation errors for debugging
            try:
                logger.warning(
                    "Register payload invalid: %s errors: %s",
                    request.data,
                    serializer.errors,
                )
            except Exception:
                logger.exception("Failed to log registration payload/errors")

            # Derive a human-friendly message from serializer errors
            def _first_error_message(errors):
                if isinstance(errors, dict):
                    for v in errors.values():
                        if isinstance(v, (list, tuple)) and v:
                            return str(v[0])
                        if isinstance(v, dict):
                            m = _first_error_message(v)
                            if m:
                                return m
                if isinstance(errors, (list, tuple)) and errors:
                    return str(errors[0])
                return "Registration failed."

            message = _first_error_message(serializer.errors)

            return api_response(
                False,
                message,
                serializer.errors,
                400,
            )

        try:

            user = serializer.save()

            # If role is LANDLORD or AGENT and required files provided, create verification and auto-approve
            if user.role in ("LANDLORD", "AGENT"):
                verification_kwargs = {}

                if "id_front" in request.FILES:
                    verification_kwargs["id_front"] = request.FILES.get("id_front")
                if "id_back" in request.FILES:
                    verification_kwargs["id_back"] = request.FILES.get("id_back")
                if "selfie" in request.FILES:
                    verification_kwargs["selfie"] = request.FILES.get("selfie")
                if "kra_pin" in request.FILES:
                    verification_kwargs["kra_pin"] = request.FILES.get("kra_pin")
                if "business_certificate" in request.FILES:
                    verification_kwargs["business_certificate"] = request.FILES.get("business_certificate")

                if verification_kwargs:
                    verification = UserVerification.objects.create(
                        user=user,
                        **verification_kwargs,
                    )
                    verification.status = UserVerification.Status.APPROVED
                    verification.save(update_fields=["status"])

                    user.is_verified = True
                    user.save(update_fields=["is_verified"]) 

            SubscriptionService.assign_free_plan(user)

            # Email verification
            create_email_verification(user)

            # Generate phone OTP
            phone_otp = create_phone_otp(user)

            return api_response(
                True,
                "Account created. Check your email and phone for verification.",
                {
                    "user": {
                        "id": str(user.id),
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "username": user.username,
                        "email": user.email,
                        "phone": user.phone,
                        "role": user.role,
                        "email_verified": user.email_verified,
                        "phone_verified": user.phone_verified,
                        "is_verified": user.is_verified,
                    }
                },
                201,
            )

        except IntegrityError:

            return api_response(
                False,
                "Registration failed.",
                {
                    "phone": [
                        "Phone number already exists."
                    ]
                },
                400,
            )
class AgentViewSet(viewsets.ReadOnlyModelViewSet):

    permission_classes = [AllowAny]
    serializer_class = AgentSerializer

    queryset = User.objects.filter(
        role="AGENT",
        is_verified=True,
    )


class AgentProfileViewSet(viewsets.ReadOnlyModelViewSet):

    permission_classes = [AllowAny]
    serializer_class = AgentProfileSerializer

    queryset = User.objects.filter(
        role="AGENT",
        is_verified=True,
    )

class VerifyEmailAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, token):

        verification = get_object_or_404(
            EmailVerificationToken,
            token=token,
        )

        if verification.is_used:
            return api_response(
                False,
                "This verification link has already been used.",
                None,
                400,
            )

        if verification.is_expired():
            return api_response(
                False,
                "This verification link has expired.",
                None,
                400,
            )

        user = verification.user

        user.email_verified = True
        user.save(
            update_fields=["email_verified"]
        )

        verification.is_used = True
        verification.save(
            update_fields=["is_used"]
        )

        account_is_verified(user)

        return api_response(
            True,
            "Email verified successfully.",
            {
                "email_verified": user.email_verified,
                "phone_verified": user.phone_verified,
                "is_verified": user.is_verified,
            },
            200,
        )

class VerifyPhoneAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):

        phone = request.data.get("phone")
        otp = request.data.get("otp")

        if not phone or not otp:

            return api_response(
                False,
                "Phone number and OTP are required.",
                None,
                400,
            )

        normalized_phone = normalize_kenyan_phone(phone)

        if not normalized_phone:
            return api_response(
                False,
                "Invalid Kenyan phone number.",
                None,
                400,
            )

        try:

            user = User.objects.get(
                phone=normalized_phone
            )

        except User.DoesNotExist:

            return api_response(
                False,
                "User with this phone number was not found.",
                None,
                404,
            )

        phone_otp = PhoneOTP.objects.filter(
            user=user,
            is_used=False,
        ).order_by("-created_at").first()

        if not phone_otp:

            return api_response(
                False,
                "No active OTP found.",
                None,
                400,
            )

        if phone_otp.is_expired():

            return api_response(
                False,
                "OTP has expired.",
                None,
                400,
            )

        if phone_otp.attempts >= 5:

            return api_response(
                False,
                "Too many attempts. Request a new OTP.",
                None,
                400,
            )

        if phone_otp.otp != otp:

            phone_otp.attempts += 1
            phone_otp.save(
                update_fields=["attempts"]
            )

            return api_response(
                False,
                "Invalid OTP.",
                None,
                400,
            )

        phone_otp.is_used = True
        phone_otp.save(
            update_fields=["is_used"]
        )

        user.phone_verified = True
        user.save(
            update_fields=["phone_verified"]
        )

        account_is_verified(user)

        return api_response(
            True,
            "Phone number verified successfully.",
            {
                "email_verified": user.email_verified,
                "phone_verified": user.phone_verified,
                "is_verified": user.is_verified,
            },
            200,
        )

class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(
            data=request.data,
            context={"request": request},
        )

        if serializer.is_valid():
            user = serializer.validated_data["user"]

            if not user.email_verified or not user.phone_verified:
                return api_response(
                    False,
                    "Please verify your email and phone number first.",
                    {
                        "email_verified": user.email_verified,
                        "phone_verified": user.phone_verified,
                    },
                    403,
                )

            login(request, user)

            user.is_online = True
            user.last_seen = timezone.now()
            user.save(update_fields=["is_online", "last_seen"])

            refresh = RefreshToken.for_user(user)

            return api_response(
                True,
                "Login successful.",
                {
                    "tokens": {
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                    },
                    "user": {
                        "id": str(user.id),
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "username": user.username,
                        "email": user.email,
                        "phone": user.phone,
                        "role": user.role,
                    },
                },
                200,
            )

        print(serializer.errors)

        return api_response(False, "Login failed.", serializer.errors, 400)

class ProfileAPIView(APIView):

    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):

        serializer = ProfileSerializer(
            request.user,
            context={"request": request},
        )

        return api_response(
            True,
            "Profile retrieved successfully.",
            serializer.data,
        )

    def put(self, request):

        serializer = ProfileSerializer(
            request.user,
            data=request.data,
            partial=True,
            context={"request": request},
        )

        if serializer.is_valid():

            serializer.save()

            return api_response(
                True,
                "Profile updated successfully.",
                serializer.data,
            )

        return api_response(
            False,
            "Profile update failed.",
            serializer.errors,
            400,
        )

    def patch(self, request):
        return self.put(request)


class RentalPassportAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        applications = RentalApplication.objects.filter(tenant=user)
        leases = Lease.objects.filter(tenant=user).select_related("property")
        payments = RentPayment.objects.filter(tenant=user)

        application_counts = {
            status_value: applications.filter(status=status_value).count()
            for status_value, _ in RentalApplication.Status.choices
        }
        payment_counts = {
            status_value: payments.filter(status=status_value).count()
            for status_value, _ in RentPayment.Status.choices
        }

        lease_summary = [
            {
                "id": str(lease.id),
                "property_title": lease.property.title,
                "status": lease.status,
                "agreement_status": lease.agreement_status,
                "tenant_signed": lease.tenant_signed,
                "start_date": lease.start_date,
                "end_date": lease.end_date,
                "monthly_rent": str(lease.monthly_rent),
            }
            for lease in leases[:10]
        ]

        return api_response(
            True,
            "Rental passport retrieved successfully.",
            {
                "profile": {
                    "name": user.get_full_name(),
                    "email": user.email,
                    "phone": user.phone,
                    "email_verified": user.email_verified,
                    "phone_verified": user.phone_verified,
                    "account_verified": user.is_verified,
                },
                "verification": {
                    "status": getattr(user.verification, "status", None),
                    "verified_at": getattr(user.verification, "verified_at", None),
                },
                "applications": {
                    "total": applications.count(),
                    "by_status": application_counts,
                },
                "leases": lease_summary,
                "payments": {
                    "total": payments.count(),
                    "by_status": payment_counts,
                    "total_paid": str(sum((payment.amount_paid for payment in payments), 0)),
                },
            },
            200,
        )

class ChangePasswordAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = ChangePasswordSerializer(
            data=request.data,
            context={
                "request": request
            }
        )

        if serializer.is_valid():

            user = request.user

            user.set_password(
                serializer.validated_data["new_password"]
            )

            user.save()

            update_session_auth_hash(
                request,
                user
            )

            return api_response(
                True,
                "Password changed successfully.",
                {},
                200,
            )

        return api_response(
            False,
            "Password change failed.",
            serializer.errors,
            400,
        )

class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        user.is_online = False
        user.last_seen = timezone.now()
        user.save(update_fields=["is_online", "last_seen"])

        logout(request)

        return api_response(
            True,
            "Logged out successfully.",
            None,
            200,
        )


class ForgotPasswordAPIView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        serializer = ForgotPasswordSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        email = serializer.validated_data["email"]

        try:

            user = User.objects.get(
                email__iexact=email
            )

        except User.DoesNotExist:

            return api_response(
                True,
                "If an account exists with this email, an OTP has been sent.",
                None,
                200
            )

        otp = PasswordResetOTP.generate(user)

        send_mail(
            subject="HomeLink Kenya Password Reset OTP",
            message=(
                f"Hello {user.first_name},\n\n"
                f"Your HomeLink Kenya password reset OTP is:\n\n"
                f"{otp.otp}\n\n"
                "This OTP expires in 10 minutes.\n"
                "If you did not request a password reset, "
                "you can ignore this email."
            ),
            from_email=None,
            recipient_list=[user.email],
            fail_silently=False,
        )

        return api_response(
            True,
            "OTP sent successfully.",
            None,
            200
        )

class VerifyOTPAPIView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        serializer = VerifyOTPSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        email = serializer.validated_data["email"]
        otp_value = serializer.validated_data["otp"]

        try:

            user = User.objects.get(
                email__iexact=email
            )

        except User.DoesNotExist:

            return api_response(
                False,
                "Invalid OTP.",
                None,
                400
            )

        otp = PasswordResetOTP.objects.filter(
            user=user,
            otp=otp_value,
            is_used=False
        ).order_by("-created_at").first()

        if not otp:

            return api_response(
                False,
                "Invalid OTP.",
                None,
                400
            )

        if not otp.is_valid():

            return api_response(
                False,
                "OTP has expired or too many attempts were made.",
                None,
                400
            )

        return api_response(
            True,
            "OTP verified successfully.",
            None,
            200
        )

class ResetPasswordAPIView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        serializer = ResetPasswordSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        email = serializer.validated_data["email"]
        otp_value = serializer.validated_data["otp"]
        password = serializer.validated_data["password"]

        try:

            user = User.objects.get(
                email__iexact=email
            )

        except User.DoesNotExist:

            return api_response(
                False,
                "Invalid reset request.",
                None,
                400
            )

        otp = PasswordResetOTP.objects.filter(
            user=user,
            otp=otp_value,
            is_used=False
        ).order_by("-created_at").first()

        if not otp:

            return api_response(
                False,
                "Invalid OTP.",
                None,
                400
            )

        if not otp.is_valid():

            return api_response(
                False,
                "OTP has expired.",
                None,
                400
            )

        user.set_password(password)

        user.save(
            update_fields=["password"]
        )

        otp.is_used = True

        otp.save(
            update_fields=["is_used"]
        )

        return api_response(
            True,
            "Password reset successfully. You can now login.",
            None,
            200
        )

class ResendPhoneOTPAPIView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        phone = request.data.get("phone")

        if not phone:
            return api_response(
                False,
                "Phone number is required.",
                None,
                400,
            )

        normalized_phone = normalize_kenyan_phone(phone)

        if not normalized_phone:
            return api_response(
                False,
                "Invalid Kenyan phone number.",
                None,
                400,
            )

        try:

            user = User.objects.get(
                phone=normalized_phone
            )

        except User.DoesNotExist:

            return api_response(
                False,
                "Account not found.",
                None,
                404,
            )

        if user.phone_verified:

            return api_response(
                False,
                "Phone number is already verified.",
                None,
                400,
            )

        phone_otp = create_phone_otp(user)

        return api_response(
            True,
            "A new OTP has been sent.",
            None,
            200,
        )

class UserVerificationAPIView(APIView):

    permission_classes = [IsAuthenticated]

    parser_classes = [
        MultiPartParser,
        FormParser,
    ]

    def get(self, request):

        verification, created = UserVerification.objects.get_or_create(
            user=request.user
        )

        serializer = UserVerificationSerializer(verification)

        return api_response(
            True,
            "Verification details retrieved.",
            serializer.data,
        )

    def post(self, request):

        verification, created = UserVerification.objects.get_or_create(
            user=request.user
        )

        serializer = UserVerificationSerializer(
            verification,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():

            user_role = request.user.role

            if user_role == User.Role.TENANT:
                if not request.FILES.get("kra_pin"):
                    return api_response(
                        False,
                        "KRA PIN is required for tenants.",
                        None,
                        400,
                    )

                if request.FILES.get("business_certificate"):
                    serializer.validated_data.pop("business_certificate", None)

            elif user_role in [User.Role.LANDLORD, User.Role.AGENT]:
                if not request.FILES.get("kra_pin"):
                    return api_response(
                        False,
                        "KRA PIN is required for landlords and agents.",
                        None,
                        400,
                    )

                if user_role == User.Role.AGENT and not request.FILES.get("business_certificate"):
                    return api_response(
                        False,
                        "Business certificate is required for agents.",
                        None,
                        400,
                    )

            instance = serializer.save()

            instance.status = UserVerification.Status.UNDER_REVIEW
            instance.save(update_fields=["status"])

            return api_response(
                True,
                "Verification documents uploaded successfully.",
                serializer.data,
            )

        return api_response(
            False,
            "Upload failed.",
            serializer.errors,
            400,
        )

class AdminVerificationListAPIView(APIView):

    permission_classes = [IsAdminUser]

    def get(self, request):

        queryset = UserVerification.objects.select_related(
            "user"
        ).order_by("-submitted_at")

        serializer = UserVerificationSerializer(
            queryset,
            many=True,
            context={"request": request},
        )

        return api_response(
            True,
            "Verification requests.",
            serializer.data,
        )

class ReviewVerificationAPIView(APIView):

    permission_classes = [IsAdminUser]

    def post(self, request, pk):

        verification = get_object_or_404(
            UserVerification,
            pk=pk,
        )

        action = request.data.get("action")

        reason = request.data.get(
            "rejection_reason",
            "",
        )

        if action == "approve":

            verification.status = "APPROVED"

            verification.reviewed_by = request.user

            verification.reviewed_at = timezone.now()

            verification.user.is_verified = True
            verification.user.save()

            verification.save()

            return api_response(
                True,
                "User approved.",
                None,
            )

        verification.status = "REJECTED"

        verification.reviewed_by = request.user

        verification.reviewed_at = timezone.now()

        verification.rejection_reason = reason

        verification.user.is_verified = False
        verification.user.save()

        verification.save()

        return api_response(
            True,
            "User rejected.",
            None,
        )