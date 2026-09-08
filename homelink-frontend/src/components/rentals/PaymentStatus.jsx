export default function PaymentStatus({
    status
}) {
    const statusMap = {
        PENDING: {
            text: "Payment Pending",
            className: "bg-warning text-dark",
        },

        SUCCESS: {
            text: "Paid",
            className: "bg-success",
        },

        PARTIAL: {
            text: "Partially Paid",
            className: "bg-info text-dark",
        },

        OVERDUE: {
            text: "Overdue",
            className: "bg-danger",
        },

        FAILED: {
            text: "Payment Failed",
            className: "bg-danger",
        },

        CANCELLED: {
            text: "Cancelled",
            className: "bg-secondary",
        },
    };

    const current =
        statusMap[status] || {
            text: status || "Unknown",
            className: "bg-secondary",
        };

    return (
        <span
            className={`badge ${current.className}`}
        >
            {current.text}
        </span>
    );
}