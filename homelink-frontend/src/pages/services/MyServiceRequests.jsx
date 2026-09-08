import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { cancelServiceRequest, getMyServiceRequests } from "../../services/servicesApi";


export default function MyServiceRequests() {

    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {
        loadRequests();
    }, []);


    const loadRequests = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getMyServiceRequests();

            setRequests(
                data.results || data
            );

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.detail ||
                "Failed to load your service requests."
            );

        } finally {

            setLoading(false);
        }
    };


    const handleCancelRequest = async (id) => {

        if (!window.confirm("Are you sure you want to cancel this request?")) {
            return;
        }

        try {

            await cancelServiceRequest(id);
            await loadRequests();

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.detail ||
                "Unable to cancel request."
            );
        }
    };


    const getStatusStyle = (status) => {

        switch (status?.toLowerCase()) {

            case "pending":
                return "bg-yellow-100 text-yellow-700";

            case "accepted":
                return "bg-blue-100 text-blue-700";

            case "in_progress":
                return "bg-purple-100 text-purple-700";

            case "completed":
                return "bg-green-100 text-green-700";

            case "cancelled":
                return "bg-red-100 text-red-700";

            case "rejected":
                return "bg-red-100 text-red-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };


    const formatStatus = (status) => {

        if (!status) {
            return "Unknown";
        }

        return status
            .replaceAll("_", " ")
            .replace(/\b\w/g, (letter) =>
                letter.toUpperCase()
            );
    };


    if (loading) {

        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading your service requests...
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-50">

            {/* Header */}

            <div className="bg-white border-b">

                <div className="max-w-6xl mx-auto px-4 py-6">

                    <button
                        onClick={() =>
                            navigate("/services")
                        }
                        className="text-blue-600 hover:underline"
                    >
                        ← Services Marketplace
                    </button>

                    <h1 className="text-3xl font-bold mt-4">
                        My Service Requests
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Track services you have requested.
                    </p>

                </div>

            </div>


            <main className="max-w-6xl mx-auto px-4 py-8">

                {error && (

                    <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-4 mb-6">
                        {error}
                    </div>

                )}


                {!error && requests.length === 0 && (

                    <div className="bg-white rounded-xl border p-12 text-center">

                        <div className="text-5xl mb-4">
                            🔧
                        </div>

                        <h2 className="text-xl font-semibold">
                            No service requests yet
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Find a professional and hire a service.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/services")
                            }
                            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                        >
                            Browse Services
                        </button>

                    </div>

                )}


                {requests.length > 0 && (

                    <div className="space-y-5">

                        {requests.map((request) => (

                            <div
                                key={request.id}
                                className="bg-white border rounded-xl p-5"
                            >

                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                                    <div>

                                        <h2 className="text-lg font-semibold">
                                            {request.listing_title ||
                                                request.listing?.title ||
                                                "Service Request"}
                                        </h2>

                                        <p className="text-gray-500 mt-1">
                                            {request.provider_name ||
                                                request.provider?.business_name ||
                                                "Service Provider"}
                                        </p>

                                        {request.property_title && (
                                            <p className="text-gray-500 mt-1">
                                                Property: {request.property_title}
                                                {request.lease_status && ` (${formatStatus(request.lease_status)} lease)`}
                                            </p>
                                        )}

                                    </div>


                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium w-fit ${getStatusStyle(
                                            request.status
                                        )}`}
                                    >
                                        {formatStatus(
                                            request.status
                                        )}
                                    </span>

                                </div>


                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">

                                    <div>

                                        <p className="text-xs text-gray-400 uppercase">
                                            Location
                                        </p>

                                        <p className="mt-1">
                                            {request.location || "Not provided"}
                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-xs text-gray-400 uppercase">
                                            Preferred Date
                                        </p>

                                        <p className="mt-1">
                                            {request.preferred_date || "Not specified"}
                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-xs text-gray-400 uppercase">
                                            Budget
                                        </p>

                                        <p className="mt-1 font-medium">
                                            {request.budget
                                                ? `KSh ${request.budget}`
                                                : "Not specified"}
                                        </p>

                                    </div>

                                </div>


                                {request.description && (

                                    <div className="mt-5 pt-5 border-t">

                                        <p className="text-xs text-gray-400 uppercase">
                                            Request Details
                                        </p>

                                        <p className="text-gray-600 mt-1">
                                            {request.description}
                                        </p>

                                    </div>

                                )}

                                <div className="flex flex-wrap gap-3 mt-5">

                                    {(["PENDING", "ACCEPTED"].includes(
                                        request.status?.toUpperCase()
                                    )) && (

                                        <button
                                            onClick={() =>
                                                handleCancelRequest(request.id)
                                            }
                                            className="border border-red-300 text-red-600 px-5 py-2 rounded-lg hover:bg-red-50"
                                        >
                                            Cancel Request
                                        </button>

                                    )}

                                    {request.status === "COMPLETED" && !request.review && (

                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/services/review?request=${request.id}`
                                                )
                                            }
                                            className="bg-yellow-500 text-white px-5 py-2 rounded-lg hover:bg-yellow-600"
                                        >
                                            ⭐ Rate This Service
                                        </button>

                                    )}

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </main>

        </div>
    );
}