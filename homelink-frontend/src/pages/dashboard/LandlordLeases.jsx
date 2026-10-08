import { useEffect, useState } from "react";
import { getMyLeases, signLease } from "../../services/leases";
import { useAuth } from "../../context/AuthContext";

function getRelatedId(value) {
    return value && typeof value === "object" ? value.id : value;
}

async function fetchLandlordLeases(landlordId) {
    const leases = await getMyLeases();

    return leases.filter(
        (lease) => String(getRelatedId(lease.landlord)) === String(landlordId)
    );
}

function getPartyLabel(value, fallback) {
    if (value && typeof value === "object") {
        return value.name || value.email || fallback;
    }

    return value ? `${fallback} #${String(value).slice(0, 8)}` : fallback;
}

export default function LandlordLeases() {
    const { user } = useAuth();
    const [leases, setLeases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [signingLeaseId, setSigningLeaseId] = useState(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        let active = true;

        async function loadLeases() {
            if (!user?.id) {
                setLoading(false);
                return;
            }

            try {
                setError("");
                const landlordLeases = await fetchLandlordLeases(user.id);
                if (active) {
                    setLeases(landlordLeases);
                }
            } catch (requestError) {
                if (active) {
                    setError(
                        requestError.response?.data?.detail ||
                        "Unable to load your lease agreements."
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        loadLeases();
        return () => {
            active = false;
        };
    }, [user?.id]);

    async function handleSignLease(lease) {
        if (!window.confirm("Sign this lease agreement as the landlord?")) {
            return;
        }

        try {
            setSigningLeaseId(lease.id);
            setError("");
            setMessage("");
            const result = await signLease(lease.id);
            const refreshedLeases = await fetchLandlordLeases(user.id);
            setLeases(refreshedLeases);
            setMessage(result.message || "Lease signed successfully.");
        } catch (requestError) {
            setError(
                requestError.response?.data?.message ||
                requestError.response?.data?.detail ||
                "Unable to sign this lease."
            );
        } finally {
            setSigningLeaseId(null);
        }
    }

    return (
        <div className="container-fluid p-4">
            <div className="mb-4">
                <h2 className="mb-1">Lease Agreements</h2>
                <p className="text-muted mb-0">
                    Review tenant signatures and complete your lease agreements.
                </p>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {message && <div className="alert alert-success">{message}</div>}

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border" role="status" />
                    <p className="mt-3">Loading lease agreements...</p>
                </div>
            ) : leases.length === 0 ? (
                <div className="alert alert-light border">
                    You don&apos;t have any lease agreements yet.
                </div>
            ) : (
                <div className="row g-3">
                    {leases.map((lease) => {
                        const tenantSigned = Boolean(lease.tenant_signed);
                        const landlordSigned = Boolean(lease.landlord_signed);
                        const canSign = tenantSigned && !landlordSigned;
                        const propertyId = getRelatedId(lease.property);

                        return (
                            <div className="col-12 col-xl-6" key={lease.id}>
                                <section className="card border-0 shadow-sm h-100">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                                            <div>
                                                <h5 className="mb-1">
                                                    {lease.property_title ||
                                                        `Property #${String(propertyId || "").slice(0, 8)}`}
                                                </h5>
                                                <small className="text-muted">
                                                    Lease #{String(lease.id).slice(0, 8)}
                                                </small>
                                            </div>
                                            <span className="badge bg-light text-dark">
                                                {lease.agreement_status || "PENDING"}
                                            </span>
                                        </div>

                                        <div className="row g-3 mb-3">
                                            <div className="col-6">
                                                <small className="text-muted d-block">Tenant</small>
                                                <span className="fw-semibold">
                                                    {lease.tenant_name ||
                                                        getPartyLabel(lease.tenant, "Tenant")}
                                                </span>
                                            </div>
                                            <div className="col-6">
                                                <small className="text-muted d-block">Monthly rent</small>
                                                <span className="fw-semibold">
                                                    KSh {Number(lease.monthly_rent || 0).toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="col-6">
                                                <small className="text-muted d-block">Start date</small>
                                                <span>{lease.start_date || "—"}</span>
                                            </div>
                                            <div className="col-6">
                                                <small className="text-muted d-block">End date</small>
                                                <span>{lease.end_date || "—"}</span>
                                            </div>
                                        </div>

                                        <div className="border-top pt-3 mb-3">
                                            <div className="d-flex justify-content-between mb-2">
                                                <span>Tenant signature</span>
                                                <span className={`badge ${tenantSigned ? "bg-success" : "bg-warning text-dark"}`}>
                                                    {tenantSigned ? "Signed" : "Pending"}
                                                </span>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <span>Landlord signature</span>
                                                <span className={`badge ${landlordSigned ? "bg-success" : "bg-warning text-dark"}`}>
                                                    {landlordSigned ? "Signed" : "Pending"}
                                                </span>
                                            </div>
                                        </div>

                                        {canSign ? (
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={() => handleSignLease(lease)}
                                                disabled={signingLeaseId !== null}
                                            >
                                                {signingLeaseId === lease.id ? "Signing..." : "Sign Lease"}
                                            </button>
                                        ) : (
                                            <p className="text-muted mb-0">
                                                {landlordSigned
                                                    ? tenantSigned
                                                        ? "Both parties have signed this lease."
                                                        : "Your signature is recorded; waiting for the tenant."
                                                    : "Waiting for the tenant to sign before you can sign."}
                                            </p>
                                        )}
                                    </div>
                                </section>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}