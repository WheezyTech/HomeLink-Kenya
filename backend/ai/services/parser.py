import re


class PropertySearchParser:

    @staticmethod
    def parse(message, previous_filters=None):

        text = message.lower().strip()

        filters = {
            "location": None,
            "min_price": None,
            "max_price": None,
            "bedrooms": None,
            "property_type": None,
            "purpose": None,
            "is_verified": None,
            "is_featured": None,
        }

        # Start with previous search filters
        if previous_filters:
            for key in filters:
                if key in previous_filters:
                    filters[key] = previous_filters[key]

        # Bedrooms
        bedroom_match = re.search(
            r"(\d+)\s*(?:bedroom|bedrooms|br|bdrm)",
            text,
        )

        if bedroom_match:
            filters["bedrooms"] = int(
                bedroom_match.group(1)
            )

        # Maximum price
        price_match = re.search(
            r"(?:under|below|less than|maximum|max|up to)"
            r"\s*(?:ksh|kes)?\s*([\d,]+)",
            text,
        )

        if price_match:
            filters["max_price"] = int(
                price_match.group(1).replace(",", "")
            )

        # Minimum price
        min_price_match = re.search(
            r"(?:above|over|minimum|min)"
            r"\s*(?:ksh|kes)?\s*([\d,]+)",
            text,
        )

        if min_price_match:
            filters["min_price"] = int(
                min_price_match.group(1).replace(",", "")
            )

        # Verified properties
        if any(
            phrase in text
            for phrase in [
                "verified",
                "verified only",
                "only verified",
            ]
        ):
            filters["is_verified"] = True

        # Featured properties
        if any(
            phrase in text
            for phrase in [
                "featured",
                "featured only",
            ]
        ):
            filters["is_featured"] = True

        # Purpose
        if any(
            word in text
            for word in [
                "rent",
                "rental",
                "for rent",
            ]
        ):
            filters["purpose"] = "RENT"

        elif any(
            word in text
            for word in [
                "buy",
                "sale",
                "purchase",
                "for sale",
            ]
        ):
            filters["purpose"] = "SALE"

        # Property type
        property_types = [
            "apartment",
            "apartments",
            "house",
            "houses",
            "bungalow",
            "bungalows",
            "maisonette",
            "maisonettes",
            "bedsitter",
            "bedsitters",
            "studio",
            "studios",
            "townhouse",
            "townhouses",
            "land",
            "office",
            "offices",
            "shop",
            "shops",
        ]

        for property_type in property_types:

            if property_type in text:

                filters["property_type"] = (
                    property_type.rstrip("s")
                )

                break

        # Kenyan locations
        locations = [
            "eldoret",
            "nairobi",
            "mombasa",
            "kisumu",
            "nakuru",
            "meru",
            "kakamega",
            "kitale",
            "thika",
            "ruiru",
            "kiambu",
        ]

        for location in locations:

            if location in text:

                filters["location"] = location

                break

        return filters