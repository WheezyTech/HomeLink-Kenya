function SubscriptionCard({ dashboard }) {

    if (!dashboard) {
        return null;
    }

    return (

        <div className="card shadow-sm border-0 h-100">

            <div className="card-body">

                <div className="d-flex justify-content-between align-items-center mb-3">

                    <h5 className="mb-0">
                        📦 Subscription
                    </h5>

                    <span className="badge bg-success">
                        Active
                    </span>

                </div>

                <h4 className="text-primary">
                    {dashboard.active_subscription || "Free Plan"}
                </h4>

                <p className="text-muted mb-2">

                    {dashboard.subscription_expiry
                        ? `Expires ${new Date(
                              dashboard.subscription_expiry
                          ).toLocaleDateString()}`
                        : "No subscription expiry"
                    }

                </p>

                <p className="mb-3">

                    <strong>
                        Remaining Property Slots:
                    </strong>{" "}

                    {dashboard.remaining_property_slots ?? "N/A"}

                </p>

                <a
                    href="/dashboard/subscriptions"
                    className="btn btn-primary"
                >
                    Manage Subscription
                </a>

            </div>

        </div>

    );

}

export default SubscriptionCard;