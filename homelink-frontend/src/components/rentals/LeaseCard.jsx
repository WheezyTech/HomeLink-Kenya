import { Link } from "react-router-dom";

export default function LeaseCard({
    lease
}) {
    const isActive =
        lease.status === "ACTIVE";

    return (
        <div className="card border-0 shadow-sm h-100">

            <div className="card-body">

                <div className="d-flex justify-content-between mb-3">

                    <div>

                        <h5>
                            {lease.property_title ||
                                lease.property?.title ||
                                "Rental Property"}
                        </h5>

                        <small className="text-muted">
                            Lease #
                            {String(
                                lease.id
                            ).slice(0, 8)}
                        </small>

                    </div>

                    <span
                        className={`badge ${
                            isActive
                                ? "bg-success"
                                : "bg-secondary"
                        }`}
                    >
                        {lease.status}
                    </span>

                </div>

                <div className="row g-3 mb-4">

                    <div className="col-6">

                        <small className="text-muted">
                            Monthly Rent
                        </small>

                        <div className="fw-semibold">
                            KSh{" "}
                            {Number(
                                lease.monthly_rent
                            ).toLocaleString()}
                        </div>

                    </div>

                    <div className="col-6">

                        <small className="text-muted">
                            Security Deposit
                        </small>

                        <div className="fw-semibold">
                            KSh{" "}
                            {Number(
                                lease.security_deposit
                            ).toLocaleString()}
                        </div>

                    </div>

                </div>

                <div className="d-grid gap-2">

                    {isActive && (
                        <Link
                            to={`/rentals/${lease.id}/pay`}
                            className="btn btn-primary"
                        >
                            Pay Rent
                        </Link>
                    )}

                    <Link
                        to={`/rentals/${lease.id}`}
                        className="btn btn-outline-secondary"
                    >
                        View Lease
                    </Link>

                    {lease.lease_document && (
                        <a
                            href={
                                lease.lease_document
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-outline-dark"
                        >
                            Download Lease
                        </a>
                    )}

                    <Link
                        to={`/rentals/${lease.id}/payments`}
                        className="btn btn-outline-success"
                    >
                        Payment History
                    </Link>

                </div>

            </div>

        </div>
    );
}