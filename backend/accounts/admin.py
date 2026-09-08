from django.contrib import admin

from .models import (
    User,
    PasswordResetOTP,
    PhoneOTP,
    EmailVerificationToken,
    UserVerification,
)


@admin.register(User)
class UserAdmin(admin.ModelAdmin):

    list_display = (
        "email",
        "first_name",
        "last_name",
        "role",
        "is_verified",
        "email_verified",
        "phone_verified",
    )

    list_filter = (
        "role",
        "is_verified",
        "email_verified",
        "phone_verified",
    )

    search_fields = (
        "email",
        "phone",
        "first_name",
        "last_name",
    )


@admin.register(UserVerification)
class UserVerificationAdmin(admin.ModelAdmin):

    list_display = (
        "user",
        "status",
        "verified_by",
        "verified_at",
        "created_at",
    )

    list_filter = (
        "status",
    )

    search_fields = (
        "user__email",
        "user__first_name",
        "user__last_name",
    )

admin.site.register(PasswordResetOTP)
admin.site.register(PhoneOTP)
admin.site.register(EmailVerificationToken)