import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import api from "../../api/axios";
import PaymentStatus from "../../components/rentals/PaymentStatus";
import ReceiptCard from "../../components/rentals/ReceiptCard";

export default function PaymentHistory() {

    const { leaseId } = useParams();

    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadPayments();
    }, [leaseId]);

    async function loadPayments() {

        try {

            setLoading(true);
            setError("");

            const response = await api.get(
                `/rent-payments/?lease=${leaseId}`
            );

            setPayments(
                response.data.results ||
                response.data ||
                []
            );

        } catch (err) {

            console.error(
                "Payment history error:",
                err
            );

            setError(
                err.response?.data?.detail ||
                err.response?.data?.message ||
                "Unable to load payment history."
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
                    Loading payment history...
                </p>

            </div>
        );
    }

    return (
        <div className="container py-4">

            {/* Header */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="mb-1">
                        Payment History
                    </h2>

                    <p className="text-muted mb-0">
                        View your rent payments and receipts.
                    </p>

                </div>

                <Link
                    to={`/rentals/${leaseId}/pay`}
                    className="btn btn-primary"
                >
                    Pay Rent
                </Link>

            </div>


            {/* Error */}

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}


            {/* No payments */}

            {!error && payments.length === 0 && (

                <div className="card border-0 shadow-sm">

                    <div className="card-body text-center py-5">

                        <h5>
                            No payments yet
                        </h5>

                        <p className="text-muted mb-3">
                            You have not made any rent payments
                            for this lease.
                        </p>

                        <Link
                            to={`/rentals/${leaseId}/pay`}
                            className="btn btn-primary"
                        >
                            Make Your First Payment
                        </Link>

                    </div>

                </div>
            )}


            {/* Payment list */}

            {payments.length > 0 && (

                <div className="row g-4">

                    {payments.map((payment) => (

                        <div
                            className="col-12"
                            key={payment.id}
                        >

                            <div className="card border-0 shadow-sm">

                                <div className="card-body">

                                    <div className="row align-items-center">

                                        {/* Date */}

                                        <div className="col-md-2">

                                            <small className="text-muted">
                                                Payment Date
                                            </small>

                                            <div className="fw-semibold">

                                                {payment.paid_at
                                                    ? new Date(
                                                        payment.paid_at
                                                    ).toLocaleDateString()
                                                    : payment.created_at
                                                        ? new Date(
                                                            payment.created_at
                                                        ).toLocaleDateString()
                                                        : "—"}

                                            </div>

                                        </div>


                                        {/* Amount */}

                                        <div className="col-md-2">

                                            <small className="text-muted">
                                                Amount Paid
                                            </small>

                                            <div className="fw-semibold">

                                                KSh{" "}

                                                {Number(
                                                    payment.amount_paid || 0
                                                ).toLocaleString()}

                                            </div>

                                        </div>


                                        {/* Amount Due */}

                                        <div className="col-md-2">

                                            <small className="text-muted">
                                                Amount Due
                                            </small>

                                            <div>

                                                KSh{" "}

                                                {Number(
                                                    payment.amount_due || 0
                                                ).toLocaleString()}

                                            </div>

                                        </div>


                                        {/* M-Pesa */}

                                        <div className="col-md-2">

                                            <small className="text-muted">
                                                M-Pesa Receipt
                                            </small>

                                            <div>

                                                {payment.mpesa_receipt_number ||
                                                    "Pending"}

                                            </div>

                                        </div>


                                        {/* Status */}

                                        <div className="col-md-2">

                                            <small className="text-muted">
                                                Status
                                            </small>

                                            <div className="mt-1">

                                                <PaymentStatus
                                                    status={
                                                        payment.status
                                                    }
                                                />

                                            </div>

                                        </div>


                                        {/* Receipt */}

                                        <div className="col-md-2">

                                            {payment.status === "PAID" && (

                                                <ReceiptCard
                                                    payment={
                                                        payment
                                                    }
                                                />

                                            )}

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>
            )}

        </div>
    );
}