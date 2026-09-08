import api from "../api/axios";

export async function createRentPayment({
    leaseId,
    amount,
    phoneNumber,
}) {
    const response = await api.post(
        "/rent-payments/",
        {
            lease: leaseId,
            amount: amount,
            phone_number: phoneNumber,
        }
    );

    return response.data;
}

export async function getRentPayments(
    leaseId
) {
    const response = await api.get(
        `/rent-payments/?lease=${leaseId}`
    );

    return (
        response.data.results ||
        response.data ||
        []
    );
}

export async function getRentPayment(
    paymentId
) {
    const response = await api.get(
        `/rent-payments/${paymentId}/`
    );

    return response.data;
}

export async function getRentReceipt(
    paymentId
) {
    const response = await api.get(
        `/rent-payments/${paymentId}/receipt/`
    );

    return response.data;
}

export async function downloadRentReceipt(
    rentPaymentId
) {
    const response = await api.get(
        `/rent-payments/${rentPaymentId}/receipt/`,
        {
            responseType: "blob",
        }
    );

    const blob = new Blob(
        [response.data],
        {
            type: "application/pdf",
        }
    );

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "HomeLink-Rent-Receipt.pdf";

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
}