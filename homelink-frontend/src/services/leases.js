import api from "../api/axios";

export async function getMyLeases() {
    const response = await api.get("/leases/");

    return response.data.results || response.data || [];
}

export async function getLease(leaseId) {
    const response = await api.get(
        `/leases/${leaseId}/`
    );

    return response.data;
}

export async function downloadLease(leaseId) {
    const response = await api.get(
        `/leases/${leaseId}/`,
        {
            responseType: "blob",
        }
    );

    return response.data;
}

export async function signLease(leaseId) {
    const response = await api.post(
        `/leases/${leaseId}/sign/`
    );

    return response.data;
}