from django.utils import timezone

from properties.models import Property


class FeaturedPropertyService:

    @staticmethod
    def expire_featured_properties():

        Property.objects.filter(
            is_featured=True,
            featured_until__lt=timezone.now(),
        ).update(
            is_featured=False,
            featured_until=None,
        )