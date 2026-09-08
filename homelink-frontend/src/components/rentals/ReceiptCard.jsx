import { useState } from "react";
import { downloadRentReceipt } from "../../services/rentPayments";

export default function ReceiptCard({ payment }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function downloadReceipt() {
        try {
            setLoading(true);
            setError("");

            await downloadRentReceipt(payment.id);

        } catch (error) {
            console.error(
                "Receipt download failed:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to download receipt."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="card border-0 shadow-sm">

            <div className="card-body">

                <div className="d-flex justify-content-between align-items-start mb-3">

                    <div>
                        <h5 className="mb-1">
                            Payment Receipt
                        </h5>

                        <small className="text-muted">
                            {payment.property_title ||
                                "Rental Property"}
                        </small>
                    </div>

                    <span
                        className={`badge ${
                            payment.status === "PAID"
                                ? "bg-success"
                                : "bg-secondary"
                        }`}
                    >
                        {payment.status}
                    </span>

                </div>

                <hr />

                <div className="row g-3">

                    <div className="col-6">
                        <small className="text-muted">
                            Receipt Number
                        </small>

                        <div className="fw-semibold">
                            {payment.receipt_number ||
                                "Not available"}
                        </div>
                    </div>

                    <div className="col-6">
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

                    <div className="col-6">
                        <small className="text-muted">
                            M-Pesa Receipt
                        </small>

                        <div>
                            {payment.mpesa_receipt_number ||
                                "Not available"}
                        </div>
                    </div>

                    <div className="col-6">
                        <small className="text-muted">
                            Paid On
                        </small>

                        <div>
                            {payment.paid_at
                                ? new Date(
                                    payment.paid_at
                                ).toLocaleString()
                                : "Not available"}
                        </div>
                    </div>

                </div>

                {error && (
                    <div className="alert alert-danger mt-3">
                        {error}
                    </div>
                )}

                {payment.status === "PAID" && (
                    <button
                        type="button"
                        className="btn btn-primary w-100 mt-4"
                        onClick={downloadReceipt}
                        disabled={loading}
                    >
                        {loading
                            ? "Preparing Receipt..."
                            : "Download PDF Receipt"}
                    </button>
                )}

            </div>

        </div>
    );
}