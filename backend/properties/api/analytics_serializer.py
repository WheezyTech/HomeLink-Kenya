from rest_framework import serializers

from properties.models import PropertyAnalytics


class PropertyAnalyticsSerializer(serializers.ModelSerializer):

    class Meta:
        model = PropertyAnalytics

        fields = "__all__"