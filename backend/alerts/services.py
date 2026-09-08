from alerts.models import SavedSearch, PropertyAlert
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

class PropertyAlertService:

    @staticmethod
    def property_matches_search(
        property,
        saved_search,
    ):

        if not saved_search.is_active:
            return False

        # Location
        if saved_search.location:

            location = (
                f"{property.county} "
                f"{property.town} "
                f"{getattr(property, 'location', '')}"
            ).lower()

            if saved_search.location.lower() not in location:
                return False

        # Property type
        if saved_search.property_type:

            property_type = str(
                getattr(
                    property,
                    "property_type",
                    "",
                )
            ).lower()

            if (
                saved_search.property_type.lower()
                not in property_type
            ):
                return False

        # Minimum price
        if (
            saved_search.min_price is not None
            and property.price < saved_search.min_price
        ):
            return False

        # Maximum price
        if (
            saved_search.max_price is not None
            and property.price > saved_search.max_price
        ):
            return False

        # Bedrooms
        if (
            saved_search.bedrooms is not None
            and getattr(property, "bedrooms", None)
            is not None
            and property.bedrooms
            < saved_search.bedrooms
        ):
            return False

        # Bathrooms
        if (
            saved_search.bathrooms is not None
            and getattr(property, "bathrooms", None)
            is not None
            and property.bathrooms
            < saved_search.bathrooms
        ):
            return False

        return True

    @classmethod
    def notify_matching_users(cls, property):

        searches = SavedSearch.objects.filter(
            is_active=True
        ).select_related("user")

        channel_layer = get_channel_layer()

        alerts_created = 0

        for search in searches:

            if not cls.property_matches_search(
                property,
                search,
            ):
                continue

            alert = PropertyAlert.objects.create(
                user=search.user,
                saved_search=search,
                property=property,
                alert_type=(
                    PropertyAlert.AlertType.NEW_PROPERTY
                ),
                title="New property matches your search",
                message=(
                    f"{property.title} matches "
                    f"your saved search "
                    f"'{search.name}'."
                ),
            )

            # Send real-time notification
            async_to_sync(
                channel_layer.group_send
            )(
                f"user_{search.user.id}_notifications",
                {
                    "type": "notification_message",
                    "notification": {
                        "type": "property_alert",
                        "id": str(alert.id),
                        "title": alert.title,
                        "message": alert.message,
                        "property_id": str(
                            property.id
                        ),
                        "alert_type": (
                            alert.alert_type
                        ),
                    },
                },
            )

            alerts_created += 1

        return alerts_created