from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from leases.models import Lease
from rent_payments.models import RentPayment


class Command(BaseCommand):
    help = "Generate monthly rent records for active leases."

    def handle(self, *args, **options):

        today = timezone.localdate()

        leases = Lease.objects.filter(
            status=Lease.Status.ACTIVE
        ).select_related(
            "tenant",
            "landlord",
            "property",
        )

        created_count = 0
        existing_count = 0

        for lease in leases:

            # Create the rent record for the current month.
            month_start = today.replace(day=1)

            # Use the lease start day as the normal
            # monthly due day, capped to the month's
            # last valid day.
            due_day = lease.start_date.day

            next_month = (
                month_start.replace(day=28)
                + timedelta(days=4)
            )

            last_day = (
                next_month
                - timedelta(days=next_month.day)
            ).day

            due_day = min(
                due_day,
                last_day,
            )

            due_date = month_start.replace(
                day=due_day
            )

            rent, created = RentPayment.objects.get_or_create(
                lease=lease,
                due_date=due_date,
                defaults={
                    "tenant": lease.tenant,
                    "landlord": lease.landlord,
                    "amount_due": lease.monthly_rent,
                    "amount_paid": 0,
                    "status": RentPayment.Status.PENDING,
                },
            )

            if created:
                created_count += 1

                self.stdout.write(
                    self.style.SUCCESS(
                        f"Created rent: "
                        f"{lease.tenant.email} - "
                        f"{due_date} - "
                        f"KSh {lease.monthly_rent}"
                    )
                )

            else:
                existing_count += 1

        self.stdout.write("")
        self.stdout.write(
            self.style.SUCCESS(
                f"Rent generation completed. "
                f"Created: {created_count}, "
                f"Already existed: {existing_count}"
            )
        )