from django.test import TestCase
from django.urls import reverse

from accounts.models import User


class LoginVerificationTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="unverified-user",
            email="unverified@example.com",
            password="StrongPass123!",
            first_name="Test",
            last_name="User",
            phone="254700000000",
        )
        self.user.is_verified = False
        self.user.email_verified = False
        self.user.phone_verified = False
        self.user.save(update_fields=["is_verified", "email_verified", "phone_verified"])

    def test_login_blocks_unverified_user(self):
        response = self.client.post(
            reverse("login"),
            {
                "email": self.user.email,
                "password": "StrongPass123!",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 403)
        self.assertFalse(response.json()["success"])
        self.assertIn("verify", response.json()["message"].lower())

    def test_login_accepts_email_for_verified_user(self):
        self.user.email_verified = True
        self.user.phone_verified = True
        self.user.is_verified = True
        self.user.save(update_fields=["is_verified", "email_verified", "phone_verified"])

        response = self.client.post(
            reverse("login"),
            {
                "email": self.user.email,
                "password": "StrongPass123!",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["success"])
        self.assertEqual(response.json()["data"]["user"]["email"], self.user.email)

    def test_login_accepts_phone_for_verified_user(self):
        self.user.email_verified = True
        self.user.phone_verified = True
        self.user.is_verified = True
        self.user.save(update_fields=["is_verified", "email_verified", "phone_verified"])

        response = self.client.post(
            reverse("login"),
            {
                "email": self.user.phone,
                "password": "StrongPass123!",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["success"])
        self.assertEqual(response.json()["data"]["user"]["email"], self.user.email)
