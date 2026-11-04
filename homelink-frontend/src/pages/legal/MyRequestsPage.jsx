import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getMyServiceRequests } from "../../services/servicesApi";

function MyRequestsPage() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getMyServiceRequests();
                setRequests(data.results || data || []);
            } catch (fetchError) {
                console.error(fetchError);
                setError(fetchError.response?.data?.detail || "Unable to load your requests from the backend.");
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const formatStatus = (status) => {
        if (!status) return "Unknown";
        return status.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-9">
                    <div className="text-center mb-5">
                        <p className="text-uppercase fw-semibold text-primary mb-2">My requests</p>
                        <h1 className="display-6 fw-bold mb-3">Your HomeLink service requests</h1>
                        <p className="text-muted fs-5">
                            This view is connected to the backend request API used by the service marketplace.
                        </p>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status" />
                            <p className="mt-3 text-muted">Loading your requests...</p>
                        </div>
                    ) : (
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-4 p-lg-5">
                                <h2 className="h4 fw-bold mb-4">Recent requests</h2>

                                {requests.length === 0 ? (
                                    <div className="text-center py-4">
                                        <p className="text-muted mb-3">You do not have any service requests yet.</p>
                                        <Link to="/services" className="btn btn-primary">Browse services</Link>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table align-middle mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Request</th>
                                                    <th>Provider</th>
                                                    <th>Status</th>
                                                    <th>Budget</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {requests.map((request) => (
                                                    <tr key={request.id}>
                                                        <td>{request.listing_title || request.listing?.title || "Service request"}</td>
                                                        <td>{request.provider_name || request.provider?.business_name || "N/A"}</td>
                                                        <td>
                                                            <span className="badge bg-light text-dark border">
                                                                {formatStatus(request.status)}
                                                            </span>
                                                        </td>
                                                        <td>{request.budget ? `KSh ${request.budget}` : "Not set"}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MyRequestsPage;
