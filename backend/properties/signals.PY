import logging

from django.db.models.signals import post_save
from django.dispatch import receiver

from properties.models import Property
from properties.models import PropertyAnalytics


logger = logging.getLogger(__name__)


@receiver(post_save, sender=Property)
def create_property_analytics(
    sender,
    instance,
    created,
    **kwargs,
):
    if created:

        PropertyAnalytics.objects.get_or_create(
            property=instance
        )

        logger.info(
            "Analytics initialized for property %s",
            instance.id,
        )