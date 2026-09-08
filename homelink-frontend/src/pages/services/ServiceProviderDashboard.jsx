import { useEffect, useState } from "react";

import {
    getProviderRequests,
    acceptServiceRequest,
    rejectServiceRequest,
    startServiceRequest,
    completeServiceRequest,
} from "../../services/servicesApi";


export default function ServiceProviderDashboard() {

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);
    const [error, setError] = useState("");


    useEffect(() => {
        loadRequests();
    }, []);


    const loadRequests = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getProviderRequests();

            setRequests(
                data.results || data
            );

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.detail ||
                "Failed to load service requests."
            );

        } finally {

            setLoading(false);
        }
    };


    const performAction = async (
        id,
        action
    ) => {

        try {

            setProcessing(id);

            if (action === "accept") {
                await acceptServiceRequest(id);
            }

            if (action === "reject") {
                await rejectServiceRequest(id);
            }

            if (action === "start") {
                await startServiceRequest(id);
            }

            if (action === "complete") {
                await completeServiceRequest(id);
            }

            await loadRequests();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                error.response?.data?.detail ||
                "Action failed."
            );

        } finally {

            setProcessing(null);
        }
    };


    const statusClass = (status) => {

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
            case "CANCELLED":
                return "bg-red-100 text-red-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };


    const formatStatus = (status) => {

        return status
            ?.replaceAll("_", " ")
            ?.replace(/\b\w/g, (letter) =>
                letter.toUpperCase()
            );
    };


    const pending = requests.filter(
        (item) => item.status === "PENDING"
    ).length;

    const accepted = requests.filter(
        (item) => item.status === "ACCEPTED"
    ).length;

    const inProgress = requests.filter(
        (item) => item.status === "IN_PROGRESS"
    ).length;

    const completed = requests.filter(
        (item) => item.status === "COMPLETED"
    ).length;


    if (loading) {

        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading provider dashboard...
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-50">

            {/* Header */}

            <div className="bg-white border-b">

                <div className="max-w-7xl mx-auto px-4 py-6">

                    <h1 className="text-3xl font-bold">
                        Service Provider Dashboard
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage your customer service requests.
                    </p>

                </div>

            </div>


            <main className="max-w-7xl mx-auto px-4 py-8">

                {error && (

                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
                        {error}
                    </div>

                )}


                {/* Statistics */}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

                    <div className="bg-white border rounded-xl p-5">

                        <p className="text-sm text-gray-500">
                            New Requests
                        </p>

                        <p className="text-3xl font-bold mt-2">
                            {pending}
                        </p>

                    </div>


                    <div className="bg-white border rounded-xl p-5">

                        <p className="text-sm text-gray-500">
                            Accepted
                        </p>

                        <p className="text-3xl font-bold mt-2">
                            {accepted}
                        </p>

                    </div>


                    <div className="bg-white border rounded-xl p-5">

                        <p className="text-sm text-gray-500">
                            In Progress
                        </p>

                        <p className="text-3xl font-bold mt-2">
                            {inProgress}
                        </p>

                    </div>


                    <div className="bg-white border rounded-xl p-5">

                        <p className="text-sm text-gray-500">
                            Completed
                        </p>

                        <p className="text-3xl font-bold mt-2">
                            {completed}
                        </p>

                    </div>

                </div>


                {/* Requests */}

                <div className="bg-white border rounded-xl">

                    <div className="p-6 border-b">

                        <h2 className="text-xl font-semibold">
                            Customer Requests
                        </h2>

                    </div>


                    {requests.length === 0 && (

                        <div className="p-12 text-center">

                            <div className="text-5xl mb-4">
                                📭
                            </div>

                            <h3 className="text-lg font-semibold">
                                No service requests
                            </h3>

                            <p className="text-gray-500 mt-1">
                                New customer requests will appear here.
                            </p>

                        </div>

                    )}


                    {requests.length > 0 && (

                        <div className="divide-y">

                            {requests.map((request) => (

                                <div
                                    key={request.id}
                                    className="p-6"
                                >

                                    <div className="flex flex-col lg:flex-row lg:justify-between gap-5">

                                        <div className="flex-1">

                                            <div className="flex flex-wrap items-center gap-3">

                                                <h3 className="text-lg font-semibold">
                                                    {request.listing_title ||
                                                        request.listing?.title ||
                                                        "Service Request"}
                                                </h3>


                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusClass(
                                                        request.status
                                                    )}`}
                                                >
                                                    {formatStatus(
                                                        request.status
                                                    )}
                                                </span>

                                            </div>


                                            <p className="text-gray-500 mt-2">
                                                Customer:{" "}
                                                {request.customer_name ||
                                                    request.customer?.name ||
                                                    request.customer?.email ||
                                                    "Customer"}
                                            </p>


                                            <p className="text-gray-600 mt-4">
                                                {request.description}
                                            </p>


                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">

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

                                        </div>


                                        {/* Actions */}

                                        <div className="flex flex-col gap-2 lg:w-40">

                                            {request.status === "PENDING" && (

                                                <>
                                                    <button
                                                        disabled={processing === request.id}
                                                        onClick={() =>
                                                            performAction(
                                                                request.id,
                                                                "accept"
                                                            )
                                                        }
                                                        className="bg-green-600 text-white py-2 px-4 rounded-lg disabled:opacity-50"
                                                    >
                                                        Accept
                                                    </button>


                                                    <button
                                                        disabled={processing === request.id}
                                                        onClick={() =>
                                                            performAction(
                                                                request.id,
                                                                "reject"
                                                            )
                                                        }
                                                        className="border border-red-300 text-red-600 py-2 px-4 rounded-lg disabled:opacity-50"
                                                    >
                                                        Reject
                                                    </button>
                                                </>

                                            )}


                                            {request.status === "ACCEPTED" && (

                                                <button
                                                    disabled={processing === request.id}
                                                    onClick={() =>
                                                        performAction(
                                                            request.id,
                                                            "start"
                                                        )
                                                    }
                                                    className="bg-purple-600 text-white py-2 px-4 rounded-lg disabled:opacity-50"
                                                >
                                                    Start Job
                                                </button>

                                            )}


                                            {request.status === "IN_PROGRESS" && (

                                                <button
                                                    disabled={processing === request.id}
                                                    onClick={() =>
                                                        performAction(
                                                            request.id,
                                                            "complete"
                                                        )
                                                    }
                                                    className="bg-blue-600 text-white py-2 px-4 rounded-lg disabled:opacity-50"
                                                >
                                                    Complete Job
                                                </button>

                                            )}

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </main>

        </div>
    );
}