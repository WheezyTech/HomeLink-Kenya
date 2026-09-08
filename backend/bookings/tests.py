from datetime import date, time, timedelta

from django.test import TestCase
from rest_framework.test import APIClient

from accounts.models import User
from bookings.models import Booking
from properties.models import Property


class BookingApprovalTests(TestCase):

    def setUp(self):
        self.client = APIClient()

        self.landlord = User.objects.create_user(
            username="landlord",
            email="landlord@example.com",
            password="testpass123",
            role=User.Roles.LANDLORD,
            phone="0700000000",
        )
        self.agent = User.objects.create_user(
            username="agent",
            email="agent@example.com",
            password="testpass123",
            role=User.Roles.AGENT,
            phone="0700000001",
        )
        self.tenant = User.objects.create_user(
            username="tenant",
            email="tenant@example.com",
            password="testpass123",
            role=User.Roles.TENANT,
            phone="0700000002",
        )

        self.property = Property.objects.create(
            owner=self.landlord,
            agent=self.agent,
            title="Luxury Apartment",
            description="A nice place",
            property_type=Property.PropertyType.APARTMENT,
            category=Property.Category.RESIDENTIAL,
            purpose=Property.Purpose.RENT,
            price=25000,
            county="Nairobi",
            estate="Westlands",
            bedrooms=2,
            bathrooms=2,
            status=Property.Status.APPROVED,
        )

        self.booking = Booking.objects.create(
            property=self.property,
            tenant=self.tenant,
            landlord=self.landlord,
            viewing_date=date.today() + timedelta(days=1),
            viewing_time=time(10, 0),
            status=Booking.Status.PENDING,
        )

    def test_agent_can_see_and_accept_incoming_viewing_request(self):
        self.client.force_authenticate(self.agent)

        list_response = self.client.get("/api/bookings/incoming/")
        self.assertEqual(list_response.status_code, 200)
        self.assertEqual(len(list_response.json()), 1)

        accept_response = self.client.post(
            f"/api/bookings/{self.booking.id}/accept/",
            {"owner_notes": "Please arrive on time."},
            format="json",
        )

        self.assertEqual(accept_response.status_code, 200)
        self.booking.refresh_from_db()
        self.assertEqual(self.booking.status, Booking.Status.ACCEPTED)
