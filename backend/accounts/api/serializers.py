from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from accounts.models import User
from django.contrib.auth import authenticate
from accounts.services.phone import normalize_kenyan_phone
from properties.api.serializers import PropertySerializer
from accounts.models import UserVerification

class RegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(
        write_only=True
    )

    class Meta:
        model = User
        fields = (
            "id",
            "first_name",
            "last_name",
            "username",
            "email",
            "phone",
            "alternative_email",
            "address",
            "id_number",
            "dob",
            "gender",
            "occupation",
            "alternate_phone",
            "emergency_contact_name",
            "emergency_contact_phone",
            "referral_source",
            "timezone",
            "language",
            "marketing_consent",
            "mpesa_number",
            "role",
            "password",
            "confirm_password",
        )

        extra_kwargs = {
            "password": {
                "write_only": True,
                "validators": [validate_password],
            }
        }

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                {
                    "confirm_password": "Passwords do not match."
                }
            )

        # Conditional requirements: certain roles must provide extra fields
        role = attrs.get("role")

        id_number = attrs.get("id_number")
        mpesa_number = attrs.get("mpesa_number")

        errors = {}

        if role in ("LANDLORD", "AGENT") and not id_number:
            errors["id_number"] = ["ID number is required for landlords and agents."]

        if role == "LANDLORD" and not mpesa_number:
            errors["mpesa_number"] = ["M-Pesa number is required for landlords."]

        if errors:
            raise serializers.ValidationError(errors)

        return attrs

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "Email already exists."
            )

        return value.lower()

    def validate_phone(self, value):

        if not value:
            return value

        phone = normalize_kenyan_phone(value)

        if not phone:
            raise serializers.ValidationError(
                "Enter a valid Kenyan phone number."
            )

        if User.objects.filter(phone=phone).exists():
            raise serializers.ValidationError(
                "Phone number already exists."
            )

        return phone

    def validate_alternative_email(self, value):
        if not value:
            return value

        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "Email already exists."
            )

        return value.lower()

    def validate_id_number(self, value):
        if not value:
            return value

        if User.objects.filter(id_number=value).exists():
            raise serializers.ValidationError(
                "ID number already exists."
            )

        return value

    def validate_alternate_phone(self, value):
        if not value:
            return value

        phone = normalize_kenyan_phone(value)

        if not phone:
            raise serializers.ValidationError(
                "Enter a valid Kenyan phone number."
            )

        return phone

    def validate_mpesa_number(self, value):
        if not value:
            return value

        phone = normalize_kenyan_phone(value)

        if not phone:
            raise serializers.ValidationError(
                "Enter a valid Kenyan M-Pesa number."
            )

        return phone

    def validate_dob(self, value):
        # Ensure user is at least 18
        from datetime import date

        if not value:
            return value

        today = date.today()
        age = today.year - value.year - ((today.month, today.day) < (value.month, value.day))

        if age < 18:
            raise serializers.ValidationError("You must be at least 18 years old to register.")

        return value
    
    def create(self, validated_data):

        validated_data.pop("confirm_password")

        password = validated_data.pop("password")

        user = User.objects.create_user(
            password=password,
            **validated_data
        )

        return user



class LoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        identifier = attrs.get("email")
        password = attrs.get("password")
        request = self.context.get("request")

        user = None

        if identifier:
            normalized_identifier = str(identifier).strip()

            user = User.objects.filter(email__iexact=normalized_identifier).first()

            if not user:
                phone = normalize_kenyan_phone(normalized_identifier)
                if phone:
                    user = User.objects.filter(phone=phone).first()

            if user and user.check_password(password):
                attrs["user"] = user
                return attrs

            user = authenticate(
                request=request,
                username=normalized_identifier,
                password=password,
            )

        if not user:
            raise serializers.ValidationError(
                "Invalid email or password."
            )

        attrs["user"] = user
        return attrs

class ProfileSerializer(serializers.ModelSerializer):

    profile_photo = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            "id",
            "first_name",
            "last_name",
            "username",
            "email",
            "phone",
            "role",
            "is_verified",
            "profile_photo",
        )

        read_only_fields = (
            "id",
            "role",
            "is_verified",
        )

    def get_profile_photo(self, obj):
        if not obj.profile_photo:
            return None

        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.profile_photo.url)

        return obj.profile_photo.url

    def validate_email(self, value):

        user = self.instance

        if User.objects.exclude(id=user.id).filter(email=value).exists():
            raise serializers.ValidationError(
                "Email already exists."
            )

        return value.lower()

    def validate_phone(self, value):

        user = self.instance

        if value and User.objects.exclude(id=user.id).filter(phone=value).exists():
            raise serializers.ValidationError(
                "Phone number already exists."
            )

        return value

class ChangePasswordSerializer(serializers.Serializer):

    current_password = serializers.CharField(
        write_only=True
    )

    new_password = serializers.CharField(
        write_only=True,
        validators=[validate_password]
    )

    confirm_password = serializers.CharField(
        write_only=True
    )

    def validate(self, attrs):

        user = self.context["request"].user

        if not user.check_password(
            attrs["current_password"]
        ):
            raise serializers.ValidationError({
                "current_password":
                    "Current password is incorrect."
            })

        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({
                "confirm_password":
                    "Passwords do not match."
            })

        if attrs["current_password"] == attrs["new_password"]:
            raise serializers.ValidationError({
                "new_password":
                    "New password must be different from your current password."
            })

        return attrs

class ForgotPasswordSerializer(serializers.Serializer):

    email = serializers.EmailField()


class VerifyOTPSerializer(serializers.Serializer):

    email = serializers.EmailField()

    otp = serializers.CharField(
        min_length=6,
        max_length=6
    )


class ResetPasswordSerializer(serializers.Serializer):

    email = serializers.EmailField()

    otp = serializers.CharField(
        min_length=6,
        max_length=6
    )

    password = serializers.CharField(
        write_only=True,
        validators=[validate_password]
    )

    confirm_password = serializers.CharField(
        write_only=True
    )

    def validate(self, attrs):

        if attrs["password"] != attrs["confirm_password"]:

            raise serializers.ValidationError({
                "confirm_password":
                    "Passwords do not match."
            })

        return attrs

class AgentSerializer(serializers.ModelSerializer):

    active_properties = serializers.SerializerMethodField()

    class Meta:
        model = User

        fields = (
            "id",
            "first_name",
            "last_name",
            "email",
            "phone",
            "county",
            "bio",
            "company_name",
            "profile_photo",
            "active_properties",
        )

    def get_active_properties(self, obj):
        return obj.properties.filter(
            status="APPROVED"
        ).count()

class AgentProfileSerializer(serializers.ModelSerializer):

    properties = serializers.SerializerMethodField()

    class Meta:
        model = User

        fields = (
            "id",
            "first_name",
            "last_name",
            "email",
            "phone",
            "county",
            "profile_photo",
            "bio",
            "company_name",
            "years_of_experience",
            "website",
            "whatsapp_number",
            "properties",
        )

    def get_properties(self, obj):

        queryset = obj.properties.filter(
            status="APPROVED"
        )

        return PropertySerializer(
            queryset,
            many=True,
            context=self.context,
        ).data

class UserVerificationSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserVerification

        fields = (
            "id",
            "user",
            "id_front",
            "id_back",
            "selfie",
            "kra_pin",
            "business_certificate",
            "status",
            "rejection_reason",
            "verified_by",
            "verified_at",
            "created_at",
        )

        read_only_fields = (
            "id",
            "user",
            "status",
            "rejection_reason",
            "verified_by",
            "verified_at",
            "created_at",
        )

    def get_profile_photo(self, obj):
        if not obj.profile_photo:
            return None

        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.profile_photo.url)

        return obj.profile_photo.url