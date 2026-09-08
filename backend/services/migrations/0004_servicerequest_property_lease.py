from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("services", "0003_servicerequest"),
        ("properties", "0006_propertydailyanalytics"),
        ("leases", "0003_lease_agreement_signed_at_lease_agreement_status_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="servicerequest",
            name="property",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="maintenance_requests",
                to="properties.property",
            ),
        ),
        migrations.AddField(
            model_name="servicerequest",
            name="lease",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="maintenance_requests",
                to="leases.lease",
            ),
        ),
    ]
