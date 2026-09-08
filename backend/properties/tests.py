from django.test import TestCase

from accounts.models import User
from properties.api.serializers import PropertySerializer
from properties.models import Property, PropertyAnalytics
from reports.models import PropertyReport


class PropertySerializerAnalyticsTest(TestCase):

    def test_serializer_exposes_analytics_metrics(self):
        owner = User.objects.create_user(
            username="owner",
            email="owner@example.com",
            password="password",
            role=User.Roles.LANDLORD,
        )

        property = Property.objects.create(
            owner=owner,
            title="Test Property",
            description="A test property",
            property_type=Property.PropertyType.STUDIO,
            price=1000,
            county="Nairobi",
            estate="Westlands",
        )

        analytics = PropertyAnalytics.objects.create(
            property=property,
            views=3,
            favourites=2,
            bookings=1,
            chats=4,
        )
        analytics.popularity_score = (
            analytics.views
            + (analytics.favourites * 5)
            + (analytics.bookings * 10)
            + (analytics.chats * 7)
        )
        analytics.save(update_fields=["popularity_score"])

        serializer = PropertySerializer(property)
        data = serializer.data

        self.assertEqual(data["views"], 3)
        self.assertEqual(data["favourites"], 2)
        self.assertEqual(data["bookings"], 1)
        self.assertEqual(data["chats"], 4)
        self.assertEqual(data["popularity_score"], 51)

    def test_serializer_exposes_explainable_trust_score(self):
        owner = User.objects.create_user(
            username="verified-owner",
            email="verified-owner@example.com",
            password="password",
            role=User.Roles.LANDLORD,
            is_verified=True,
            phone="254712345678",
            phone_verified=True,
            email_verified=True,
        )
        property = Property.objects.create(
            owner=owner,
            title="Verified Property",
            description="A verified test property",
            property_type=Property.PropertyType.STUDIO,
            price=1000,
            county="Nairobi",
            estate="Westlands",
            is_verified=True,
            location_verified=True,
        )

        data = PropertySerializer(property).data

        self.assertEqual(data["trust_score"]["score"], 90)
        self.assertEqual(data["trust_score"]["label"], "Highly trusted")
        self.assertTrue(data["trust_score"]["checks"][0]["verified"])

    def test_pending_reports_reduce_trust_score_transparently(self):
        owner = User.objects.create_user(
            username="reported-owner",
            email="reported-owner@example.com",
            password="password",
            role=User.Roles.LANDLORD,
            is_verified=True,
            phone="254712345679",
            phone_verified=True,
            email_verified=True,
        )
        property = Property.objects.create(
            owner=owner,
            title="Reported Property",
            description="A reported test property",
            property_type=Property.PropertyType.STUDIO,
            price=1000,
            county="Nairobi",
            estate="Westlands",
            is_verified=True,
            location_verified=True,
        )
        PropertyReport.objects.create(
            property=property,
            reporter=owner,
            reason=PropertyReport.Reason.FRAUD,
            description="Please review this listing.",
        )

        data = PropertySerializer(property).data

        self.assertEqual(data["trust_score"]["score"], 85)
        self.assertEqual(data["trust_score"]["pending_reports"], 1)
        self.assertEqual(data["trust_score"]["report_penalty"], 5)
