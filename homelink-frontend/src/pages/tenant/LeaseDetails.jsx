import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../api/axios";
import { signLease } from "../../services/leases";
import { useAuth } from "../../context/AuthContext";

export default function LeaseDetails() {
    const { leaseId } = useParams();
    const { user } = useAuth();

    const [lease, setLease] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [signing, setSigning] = useState(false);
    const [signMessage, setSignMessage] = useState("");

    useEffect(() => {
        loadLease();
    }, [leaseId]);

    async function handleSignLease() {
        const confirmed = window.confirm(
            "Are you sure you want to electronically sign this lease agreement?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setSigning(true);
            setSignMessage("");
            setError("");

            const data = await signLease(leaseId);

            setSignMessage(
                data.message || "Lease signed successfully."
            );

            await loadLease();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                err.response?.data?.detail ||
                "Unable to sign the lease."
            );
        } finally {
            setSigning(false);
        }
    }

    async function loadLease() {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                `/leases/${leaseId}/`
            );

            setLease(response.data);

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.detail ||
                err.response?.data?.message ||
                "Unable to load lease details."
            );
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div
                    className="spinner-border"
                    role="status"
                />

                <p className="mt-3">
                    Loading lease details...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5">

                <div className="alert alert-danger">
                    {error}
                </div>

                <Link
                    to="/tenant/my-rentals"
                    className="btn btn-secondary"
                >
                    Back to My Rentals
                </Link>

            </div>
        );
    }

    if (!lease) {
        return (
            <div className="container py-5">

                <div className="alert alert-warning">
                    Lease not found.
                </div>

                <Link
                    to="/tenant/my-rentals"
                    className="btn btn-secondary"
                >
                    Back to My Rentals
                </Link>

            </div>
        );
    }

    const propertyTitle =
        lease.property_title ||
        lease.property?.title ||
        "Rental Property";

    const landlordName =
        lease.landlord_name ||
        lease.landlord?.name ||
        lease.landlord?.email ||
        "Landlord";

    return (
        <div className="container py-4">

            {/* Header */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="mb-1">
                        Lease Details
                    </h2>

                    <p className="text-muted mb-0">
                        {propertyTitle}
                    </p>

                </div>

                <span
                    className={`badge ${
                        lease.status === "ACTIVE"
                            ? "bg-success"
                            : lease.status === "EXPIRED"
                            ? "bg-warning text-dark"
                            : "bg-secondary"
                    }`}
                >
                    {lease.status}
                </span>

            </div>


            {/* Lease Information */}

            <div className="row g-4">

                <div className="col-12 col-lg-8">

                    <div className="card border-0 shadow-sm mb-4">

                        <div className="card-body">

                            <h5 className="mb-4">
                                Lease Information
                            </h5>

                            <div className="row g-4">

                                <div className="col-12 col-md-6">

                                    <small className="text-muted">
                                        Property
                                    </small>

                                    <div className="fw-semibold">
                                        {propertyTitle}
                                    </div>

                                </div>

                                <div className="col-12 col-md-6">

                                    <small className="text-muted">
                                        Landlord
                                    </small>

                                    <div className="fw-semibold">
                                        {landlordName}
                                    </div>

                                </div>

                                <div className="col-12 col-md-6">

                                    <small className="text-muted">
                                        Monthly Rent
                                    </small>

                                    <div className="fw-semibold">
                                        KSh{" "}
                                        {Number(
                                            lease.monthly_rent || 0
                                        ).toLocaleString()}
                                    </div>

                                </div>

                                <div className="col-12 col-md-6">

                                    <small className="text-muted">
                                        Security Deposit
                                    </small>

                                    <div className="fw-semibold">
                                        KSh{" "}
                                        {Number(
                                            lease.security_deposit || 0
                                        ).toLocaleString()}
                                    </div>

                                </div>

                                <div className="col-12 col-md-6">

                                    <small className="text-muted">
                                        Start Date
                                    </small>

                                    <div>
                                        {lease.start_date || "—"}
                                    </div>

                                </div>

                                <div className="col-12 col-md-6">

                                    <small className="text-muted">
                                        End Date
                                    </small>

                                    <div>
                                        {lease.end_date || "—"}
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* Electronic Signature */}

                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body">

                            <h5 className="mb-3">
                                Electronic Signature
                            </h5>

                            {signMessage && (
                                <div className="alert alert-success">
                                    {signMessage}
                                </div>
                            )}

                            <div className="mb-3">

                                <div className="d-flex justify-content-between mb-2">
                                    <span>Landlord</span>

                                    {lease.landlord_signed ? (
                                        <span className="badge bg-success">
                                            ✓ Signed
                                        </span>
                                    ) : (
                                        <span className="badge bg-warning text-dark">
                                            Pending
                                        </span>
                                    )}
                                </div>

                                <div className="d-flex justify-content-between">
                                    <span>Tenant</span>

                                    {lease.tenant_signed ? (
                                        <span className="badge bg-success">
                                            ✓ Signed
                                        </span>
                                    ) : (
                                        <span className="badge bg-warning text-dark">
                                            Pending
                                        </span>
                                    )}
                                </div>

                            </div>

                            <div className="mb-3">

                                <small className="text-muted">
                                    Agreement Status
                                </small>

                                <div className="fw-semibold">
                                    {lease.agreement_status || "PENDING"}
                                </div>

                            </div>

                            {!(
                                user?.id && lease?.landlord?.id === user.id ? lease.landlord_signed : lease.tenant_signed
                            ) && (
                                <button
                                    type="button"
                                    className="btn btn-primary w-100"
                                    onClick={handleSignLease}
                                    disabled={signing}
                                >
                                    {signing ? (
                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm me-2"
                                            />
                                            Signing...
                                        </>
                                    ) : (
                                        user?.id && lease?.landlord?.id === user.id
                                            ? "Sign as Landlord"
                                            : "Sign as Tenant"
                                    )}
                                </button>
                            )}

                            {lease.agreement_status === "SIGNED" && (
                                <div className="alert alert-success mb-0">
                                    ✓ This lease agreement has been electronically signed by both parties.
                                </div>
                            )}

                        </div>
                    </div>

                    {/* Lease Document */}

                    <div className="card border-0 shadow-sm">

                        <div className="card-body">

                            <h5 className="mb-3">
                                Lease Document
                            </h5>

                            {lease.lease_document ? (

                                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">

                                    <div>
                                        <div className="fw-semibold">
                                            Rental Lease Agreement
                                        </div>

                                        <small className="text-muted">
                                            Download the signed lease document for your records.
                                        </small>
                                    </div>

                                    <a
                                        href={
                                            lease.lease_document
                                        }
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn btn-outline-primary"
                                    >
                                        Download Lease
                                    </a>

                                </div>

                            ) : (

                                <div className="alert alert-light mb-0">
                                    No lease document has been uploaded yet.
                                </div>

                            )}

                        </div>

                    </div>

                </div>


                {/* Actions */}

                <div className="col-12 col-lg-4">

                    <div className="card border-0 shadow-sm">

                        <div className="card-body">

                            <h5 className="mb-3">
                                Rental Actions
                            </h5>

                            {lease.status === "ACTIVE" && (
                                <Link
                                    to={`/rentals/${lease.id}/pay`}
                                    className="btn btn-primary w-100 mb-2"
                                >
                                    Pay Rent
                                </Link>
                            )}

                            <Link
                                to={`/rentals/${lease.id}/payments`}
                                className="btn btn-outline-success w-100 mb-2"
                            >
                                Payment History
                            </Link>

                            <Link
                                to="/tenant/my-rentals"
                                className="btn btn-outline-secondary w-100"
                            >
                                Back to My Rentals
                            </Link>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}