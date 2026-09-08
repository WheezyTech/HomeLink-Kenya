import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import { createRentPayment } from "../../services/rentPayments";

export default function RentPaymentModal({
    lease,
    show,
    onClose,
    onSuccess,
}) {
    const { leaseId: routeLeaseId } = useParams();
    const navigate = useNavigate();

    const [leaseData, setLeaseData] = useState(lease || null);
    const [amount, setAmount] = useState(
        lease?.monthly_rent || ""
    );
    const [phoneNumber, setPhoneNumber] =
        useState("");
    const [loading, setLoading] =
        useState(false);
    const [pageLoading, setPageLoading] =
        useState(!lease && Boolean(routeLeaseId));
    const [error, setError] =
        useState("");
    const [success, setSuccess] =
        useState("");

    const isStandalone = show === undefined;
    const currentLease = leaseData || lease || null;
    const activeLeaseId = currentLease?.id || routeLeaseId;

    useEffect(() => {
        if (lease) {
            setLeaseData(lease);
            setAmount(lease?.monthly_rent || "");
            setPageLoading(false);
            return;
        }

        if (!routeLeaseId) {
            setPageLoading(false);
            return;
        }

        let isMounted = true;

        async function loadLease() {
            try {
                setPageLoading(true);
                setError("");

                const response = await api.get(
                    `/leases/${routeLeaseId}/`
                );

                if (isMounted) {
                    setLeaseData(response.data);
                    setAmount(
                        response.data?.monthly_rent || ""
                    );
                }
            } catch (err) {
                console.error(err);

                if (isMounted) {
                    setError(
                        err.response?.data?.detail ||
                        err.response?.data?.message ||
                        "Unable to load lease details."
                    );
                }
            } finally {
                if (isMounted) {
                    setPageLoading(false);
                }
            }
        }

        loadLease();

        return () => {
            isMounted = false;
        };
    }, [lease, routeLeaseId]);

    if (show === false) {
        return null;
    }

    function handleClose() {
        if (onClose) {
            onClose();
            return;
        }

        if (isStandalone) {
            navigate(-1);
            return;
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (!activeLeaseId) {
            setError("Lease information is missing.");
            return;
        }

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const response =
                await createRentPayment({
                    leaseId: activeLeaseId,
                    amount,
                    phoneNumber,
                });

            if (response.success) {
                setSuccess(
                    response.message ||
                    "Payment request sent successfully. Check your phone for the M-Pesa prompt."
                );

                if (onSuccess) {
                    onSuccess(response);
                }
            } else {
                setError(
                    response.message ||
                    "Unable to initiate payment."
                );
            }
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                err.response?.data?.detail ||
                "Unable to initiate rent payment."
            );
        } finally {
            setLoading(false);
        }
    }

    const propertyTitle =
        currentLease?.property_title ||
        currentLease?.property?.title ||
        "Rental Property";

    const formContent = (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label">
                    Property
                </label>

                <input
                    type="text"
                    className="form-control"
                    value={propertyTitle}
                    disabled
                />
            </div>

            <div className="mb-3">
                <label className="form-label">
                    Rent Amount
                </label>

                <input
                    type="number"
                    className="form-control"
                    value={amount}
                    onChange={(event) =>
                        setAmount(event.target.value)
                    }
                    min="1"
                    required
                />
            </div>

            <div className="mb-3">
                <label className="form-label">
                    M-Pesa Phone Number
                </label>

                <input
                    type="tel"
                    className="form-control"
                    placeholder="07XXXXXXXX"
                    value={phoneNumber}
                    onChange={(event) =>
                        setPhoneNumber(event.target.value)
                    }
                    required
                />

                <small className="text-muted">
                    An M-Pesa prompt will be sent to this number.
                </small>
            </div>

            <div className="d-flex justify-content-end gap-2">
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleClose}
                    disabled={loading}
                >
                    {isStandalone ? "Back" : "Cancel"}
                </button>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? "Sending..." : "Pay with M-Pesa"}
                </button>
            </div>
        </form>
    );

    if (isStandalone) {
        return (
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-7">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-start mb-4">
                                    <div>
                                        <h2 className="mb-1">
                                            Pay Rent
                                        </h2>
                                        <p className="text-muted mb-0">
                                            Send an M-Pesa request for this lease.
                                        </p>
                                    </div>

                                    <Link
                                        to="/tenant/my-rentals"
                                        className="btn btn-outline-secondary btn-sm"
                                    >
                                        My Rentals
                                    </Link>
                                </div>

                                {error && (
                                    <div className="alert alert-danger">
                                        {error}
                                    </div>
                                )}

                                {success && (
                                    <div className="alert alert-success">
                                        {success}
                                    </div>
                                )}

                                {pageLoading ? (
                                    <div className="text-center py-4">
                                        <div
                                            className="spinner-border"
                                            role="status"
                                        />
                                        <p className="mt-3 mb-0">
                                            Loading lease details...
                                        </p>
                                    </div>
                                ) : (
                                    formContent
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="modal d-block"
            tabIndex="-1"
            role="dialog"
            style={{
                backgroundColor:
                    "rgba(0, 0, 0, 0.5)",
            }}
        >
            <div
                className="modal-dialog modal-dialog-centered"
                role="document"
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            Pay Rent
                        </h5>

                        <button
                            type="button"
                            className="btn-close"
                            onClick={handleClose}
                            disabled={loading}
                        />
                    </div>

                    <div className="modal-body">
                        {error && (
                            <div className="alert alert-danger">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="alert alert-success">
                                {success}
                            </div>
                        )}

                        {pageLoading ? (
                            <div className="text-center py-4">
                                <div
                                    className="spinner-border"
                                    role="status"
                                />
                                <p className="mt-3 mb-0">
                                    Loading lease details...
                                </p>
                            </div>
                        ) : (
                            formContent
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}