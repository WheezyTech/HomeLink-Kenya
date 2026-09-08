import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://127.0.0.1:8000/api";

export default function ProviderRequests() {

    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);

    const token = localStorage.getItem("access_token");

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };


    useEffect(() => {
        loadRequests();
    }, []);


    async function loadRequests() {

        try {

            const response = await axios.get(
                `${API}/services/provider/requests/`,
                config
            );

            setRequests(
                response.data.results || response.data
            );

        } catch (error) {

            console.error(error);

            alert(
                "Unable to load service requests."
            );

        } finally {

            setLoading(false);
        }
    }


    async function updateRequest(id, action) {

        try {

            setProcessing(id);

            await axios.post(
                `${API}/services/provider/requests/${id}/${action}/`,
                {},
                config
            );

            await loadRequests();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.detail ||
                error.response?.data?.message ||
                `Unable to ${action} request.`
            );

        } finally {

            setProcessing(null);
        }
    }


    function statusStyle(status) {

        switch (status) {

            case "PENDING":
                return "bg-yellow-100 text-yellow-700";

            case "ACCEPTED":
                return "bg-blue-100 text-blue-700";

            case "IN_PROGRESS":
                return "bg-purple-100 text-purple-700";

            case "COMPLETED":
                return "bg-green-100 text-green-700";

            case "REJECTED":
                return "bg-red-100 text-red-700";

            case "CANCELLED":
                return "bg-gray-100 text-gray-600";

            default:
                return "bg-gray-100 text-gray-600";
        }
    }


    if (loading) {

        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading requests...
            </div>
        );
    }


    return (

        <div className="min-h-screen bg-gray-50">

            <header className="bg-white border-b">

                <div className="max-w-6xl mx-auto px-4 py-5 flex justify-between items-center">

                    <div>

                        <h1 className="text-2xl font-bold">
                            Service Requests
                        </h1>

                        <p className="text-gray-500">
                            Manage customer jobs
                        </p>

                    </div>

                    <button
                        onClick={() =>
                            navigate(
                                "/services/provider/dashboard"
                            )
                        }
                        className="border px-4 py-2 rounded-lg"
                    >
                        Dashboard
                    </button>

                </div>

            </header>


            <main className="max-w-6xl mx-auto px-4 py-8">

                {requests.length === 0 ? (

                    <div className="bg-white border rounded-xl p-10 text-center">

                        <h2 className="text-xl font-semibold">
                            No service requests
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Customer requests will appear here.
                        </p>

                    </div>

                ) : (

                    <div className="space-y-5">

                        {requests.map(request => (

                            <div
                                key={request.id}
                                className="bg-white border rounded-xl p-6"
                            >

                                <div className="flex flex-col md:flex-row md:justify-between gap-4">

                                    <div>

                                        <h2 className="text-xl font-bold">
                                            {request.listing_title}
                                        </h2>

                                        <p className="text-gray-500 mt-1">
                                            Customer:{" "}
                                            {request.customer_name ||
                                                "Customer"}
                                        </p>

                                    </div>


                                    <span
                                        className={`self-start px-4 py-2 rounded-full text-sm font-medium ${statusStyle(
                                            request.status
                                        )}`}
                                    >
                                        {request.status}
                                    </span>

                                </div>


                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

                                    <Info
                                        label="Location"
                                        value={
                                            request.service_location
                                        }
                                    />

                                    <Info
                                        label="County"
                                        value={
                                            request.county
                                        }
                                    />

                                    <Info
                                        label="Date"
                                        value={
                                            request.preferred_date
                                        }
                                    />

                                    <Info
                                        label="Time"
                                        value={
                                            request.preferred_time ||
                                            "Flexible"
                                        }
                                    />

                                    <Info
                                        label="Budget"
                                        value={
                                            request.budget
                                                ? `KSh ${request.budget}`
                                                : "Not specified"
                                        }
                                    />

                                    <Info
                                        label="Customer Phone"
                                        value={
                                            request.customer_phone
                                        }
                                    />

                                </div>


                                {request.description && (

                                    <div className="mt-6">

                                        <h3 className="font-semibold">
                                            Customer Description
                                        </h3>

                                        <p className="text-gray-600 mt-2">
                                            {request.description}
                                        </p>

                                    </div>

                                )}


                                <div className="flex flex-wrap gap-3 mt-6">

                                    {request.status === "PENDING" && (

                                        <>
                                            <button
                                                disabled={
                                                    processing ===
                                                    request.id
                                                }
                                                onClick={() =>
                                                    updateRequest(
                                                        request.id,
                                                        "accept"
                                                    )
                                                }
                                                className="bg-green-600 text-white px-5 py-2 rounded-lg disabled:opacity-50"
                                            >
                                                Accept
                                            </button>

                                            <button
                                                disabled={
                                                    processing ===
                                                    request.id
                                                }
                                                onClick={() =>
                                                    updateRequest(
                                                        request.id,
                                                        "reject"
                                                    )
                                                }
                                                className="bg-red-600 text-white px-5 py-2 rounded-lg disabled:opacity-50"
                                            >
                                                Reject
                                            </button>
                                        </>

                                    )}


                                    {request.status === "ACCEPTED" && (

                                        <button
                                            disabled={
                                                processing ===
                                                request.id
                                            }
                                            onClick={() =>
                                                updateRequest(
                                                    request.id,
                                                    "start"
                                                )
                                            }
                                            className="bg-blue-600 text-white px-5 py-2 rounded-lg disabled:opacity-50"
                                        >
                                            Start Job
                                        </button>

                                    )}


                                    {request.status === "IN_PROGRESS" && (

                                        <button
                                            disabled={
                                                processing ===
                                                request.id
                                            }
                                            onClick={() =>
                                                updateRequest(
                                                    request.id,
                                                    "complete"
                                                )
                                            }
                                            className="bg-green-600 text-white px-5 py-2 rounded-lg disabled:opacity-50"
                                        >
                                            Mark Completed
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


function Info({ label, value }) {

    return (

        <div className="bg-gray-50 rounded-lg p-4">

            <p className="text-sm text-gray-500">
                {label}
            </p>

            <p className="font-medium mt-1">
                {value || "-"}
            </p>

        </div>

    );
}