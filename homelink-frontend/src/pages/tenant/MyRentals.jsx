import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

export default function MyRentals() {
    const [leases, setLeases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadLeases();
    }, []);

    async function loadLeases() {
        try {
            const response = await api.get("/leases/");

            setLeases(response.data.results || response.data);
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.detail ||
                "Unable to load your rentals."
            );
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="container py-4">
                <div className="text-center py-5">
                    <div
                        className="spinner-border"
                        role="status"
                    />
                    <p className="mt-3">
                        Loading your rentals...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-4">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-1">
                        My Rentals
                    </h2>

                    <p className="text-muted mb-0">
                        Manage your active leases,
                        rent and payment history.
                    </p>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {!error && leases.length === 0 && (
                <div className="card border-0 shadow-sm">
                    <div className="card-body text-center py-5">

                        <h5>
                            No rentals found
                        </h5>

                        <p className="text-muted">
                            You don't have any leases yet.
                        </p>

                        <Link
                            to="/properties"
                            className="btn btn-primary"
                        >
                            Find a Property
                        </Link>

                    </div>
                </div>
            )}

            <div className="row g-4">

                {leases.map((lease) => (
                    <div
                        className="col-12 col-lg-6"
                        key={lease.id}
                    >
                        <LeaseCard lease={lease} />
                    </div>
                ))}

            </div>
        </div>
    );
}


function LeaseCard({ lease }) {

    const isActive =
        lease.status === "ACTIVE";

    return (
        <div className="card border-0 shadow-sm h-100">

            <div className="card-body">

                <div className="d-flex justify-content-between align-items-start mb-3">

                    <div>
                        <h5 className="mb-1">
                            {lease.property_title ||
                                lease.property?.title ||
                                "Rental Property"}
                        </h5>

                        <small className="text-muted">
                            Lease #{String(lease.id).slice(0, 8)}
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

                    <div className="col-6">
                        <small className="text-muted">
                            Start Date
                        </small>

                        <div>
                            {lease.start_date}
                        </div>
                    </div>

                    <div className="col-6">
                        <small className="text-muted">
                            End Date
                        </small>

                        <div>
                            {lease.end_date}
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