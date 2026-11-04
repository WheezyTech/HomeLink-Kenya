from django.contrib import admin

from .models import ContactSubmission


@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    list_display = ["full_name", "email", "subject", "created_at", "is_resolved"]
    list_filter = ["is_resolved", "created_at"]
    search_fields = ["full_name", "email", "subject", "message"]
    readonly_fields = ["created_at"]
