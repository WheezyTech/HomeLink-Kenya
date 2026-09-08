import re

from properties.models import Property


class AISearchService:

    @staticmethod
    def search(query):

        query = query.lower().strip()

        filters = {
            "status": Property.Status.APPROVED,
        }

        # Rent / buy
        if "rent" in query or "rental" in query:
            filters["purpose"] = "RENT"

        elif "buy" in query or "sale" in query:
            filters["purpose"] = "SALE"

        # Bedrooms
        bedroom_match = re.search(
            r"(\d+)\s*(?:bedroom|bedrooms|br)",
            query,
        )

        if bedroom_match:
            filters["bedrooms"] = int(
                bedroom_match.group(1)
            )

        # Price
        price_match = re.search(
            r"(?:under|below|less than|max(?:imum)?)[^\d]*(\d[\d,]*)",
            query,
        )

        if price_match:
            price = int(
                price_match.group(1).replace(",", "")
            )

            filters["price__lte"] = price

        queryset = Property.objects.filter(
            **filters
        ).select_related(
            "owner",
        ).order_by(
            "-is_featured",
            "-created_at",
        )

        return queryset