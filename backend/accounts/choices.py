from django.db import models


class UserRole(models.TextChoices):
    TENANT = "TENANT", "Tenant"
    LANDLORD = "LANDLORD", "Landlord"
    AGENT = "AGENT", "Agent"
    ADMIN = "ADMIN", "Administrator"