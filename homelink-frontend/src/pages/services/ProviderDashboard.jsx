import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000/api";

function getAuthConfig() {
    const token = localStorage.getItem("access_token");

    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
}

export default function ProviderDashboard() {

    const navigate = useNavigate();

    const [provider, setProvider] = useState(null);
    const [listings, setListings] = useState([]);
    const [requests, setRequests] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {
        loadDashboard();
    }, []);


    const loadDashboard = async () => {

        try {

            setLoading(true);
            setError("");

            const config = getAuthConfig();

            const [
                providerResponse,
                listingsResponse,
                requestsResponse,
            ] = await Promise.all([

                fetch(
                    `${API_URL}/services/providers/me/`,
                    config
                ),

                fetch(
                    `${API_URL}/services/listings/mine/`,
                    config
                ),

                fetch(
                    `${API_URL}/services/provider/requests/`,
                    config
                ),
            ]);


            if (!providerResponse.ok) {
                throw new Error(
                    "Failed to load provider profile."
                );
            }


            const providerData =
                await providerResponse.json();

            const listingsData =
                await listingsResponse.json();

            const requestsData =
                await requestsResponse.json();


            setProvider(
                providerData.provider || null
            );

            setListings(
                listingsData.results || listingsData
            );

            setRequests(
                requestsData.results || requestsData
            );

        } catch (error) {

            console.error(error);

            setError(
                error.message ||
                "Failed to load dashboard."
            );

        } finally {

            setLoading(false);
        }
    };


    if (loading) {

        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading provider dashboard...
            </div>
        );
    }


    if (!provider) {

        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

                <div className="bg-white border rounded-xl p-8 text-center max-w-md">

                    <h1 className="text-2xl font-bold">
                        Become a Service Provider
                    </h1>

                    <p className="text-gray-500 mt-3">
                        Register your business and start offering
                        services to customers on HomeLink Kenya.
                    </p>

                    <button
                        onClick={() =>
                            navigate(
                                "/services/provider/register"
                            )
                        }
                        className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
                    >
                        Register as Provider
                    </button>

                </div>

            </div>
        );
    }


    const pendingRequests = requests.filter(
        request =>
            request.status === "PENDING"
    );

    const activeJobs = requests.filter(
        request =>
            [
                "ACCEPTED",
                "IN_PROGRESS",
            ].includes(request.status)
    );

    const completedJobs = requests.filter(
        request =>
            request.status === "COMPLETED"
    );


    return (
        <div className="min-h-screen bg-gray-50">

            {/* Header */}

            <header className="bg-white border-b">

                <div className="max-w-7xl mx-auto px-4 py-5 flex justify-between items-center">

                    <div>

                        <h1 className="text-2xl font-bold">
                            Provider Dashboard
                        </h1>

                        <p className="text-gray-500">
                            {provider.business_name}
                        </p>

                    </div>


                    <button
                        onClick={() =>
                            navigate("/services")
                        }
                        className="border px-4 py-2 rounded-lg"
                    >
                        Marketplace
                    </button>

                </div>

            </header>


            <main className="max-w-7xl mx-auto px-4 py-8">

                {error && (

                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
                        {error}
                    </div>

                )}


                {/* Verification */}

                <div className="bg-white border rounded-xl p-6 mb-8">

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                        <div>

                            <h2 className="text-xl font-bold">
                                {provider.business_name}
                            </h2>

                            <p className="text-gray-500 mt-1">
                                {provider.provider_type}
                            </p>

                        </div>


                        <div>

                            {provider.verification_status ===
                                "VERIFIED" ? (

                                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-medium">
                                    ✓ Verified Provider
                                </span>

                            ) : provider.verification_status ===
                                "REJECTED" ? (

                                <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-medium">
                                    Verification Rejected
                                </span>

                            ) : (

                                <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-medium">
                                    Verification Pending
                                </span>

                            )}

                        </div>

                    </div>

                </div>


                {/* Statistics */}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                    <StatCard
                        title="Services"
                        value={listings.length}
                    />

                    <StatCard
                        title="Pending Requests"
                        value={pendingRequests.length}
                    />

                    <StatCard
                        title="Active Jobs"
                        value={activeJobs.length}
                    />

                    <StatCard
                        title="Completed Jobs"
                        value={provider.completed_jobs || completedJobs.length}
                    />

                </div>


                {/* Rating */}

                <div className="bg-white border rounded-xl p-6 mt-6">

                    <div className="flex items-center gap-4">

                        <div className="text-4xl font-bold">
                            {provider.rating || "0.00"}
                        </div>

                        <div>

                            <div className="text-yellow-500 text-xl">
                                {"★".repeat(
                                    Math.round(
                                        Number(provider.rating || 0)
                                    )
                                )}
                            </div>

                            <p className="text-gray-500">
                                Provider rating
                            </p>

                        </div>

                    </div>

                </div>


                {/* Quick actions */}

                <div className="flex flex-wrap gap-3 mt-8">

                    <button
                        onClick={() =>
                            navigate(
                                "/services/provider/listings/new"
                            )
                        }
                        className="bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold"
                    >
                        + Add Service
                    </button>

                    <button
                        onClick={() =>
                            navigate(
                                "/services/provider/requests"
                            )
                        }
                        className="border bg-white px-5 py-3 rounded-lg font-semibold"
                    >
                        View Requests
                    </button>

                    <button
                        onClick={() =>
                            navigate(
                                `/services/providers/${provider.id}`
                            )
                        }
                        className="border bg-white px-5 py-3 rounded-lg font-semibold"
                    >
                        View Public Profile
                    </button>

                </div>


                {/* My services */}

                <section className="mt-10">

                    <div className="flex justify-between items-center mb-5">

                        <h2 className="text-2xl font-bold">
                            My Services
                        </h2>

                        <button
                            onClick={() =>
                                navigate(
                                    "/services/provider/listings/new"
                                )
                            }
                            className="text-blue-600 font-medium"
                        >
                            + Add Service
                        </button>

                    </div>


                    {listings.length === 0 ? (

                        <div className="bg-white border rounded-xl p-8 text-center">

                            <h3 className="font-semibold text-lg">
                                No services yet
                            </h3>

                            <p className="text-gray-500 mt-2">
                                Create your first service listing.
                            </p>

                        </div>

                    ) : (

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                            {listings.map(
                                listing => (

                                    <div
                                        key={listing.id}
                                        className="bg-white border rounded-xl p-5"
                                    >

                                        <h3 className="font-bold text-lg">
                                            {listing.title}
                                        </h3>

                                        <p className="text-gray-500 text-sm mt-2 line-clamp-3">
                                            {listing.description}
                                        </p>

                                        <div className="mt-4 flex justify-between">

                                            <span className="font-semibold text-blue-600">
                                                {listing.price
                                                    ? `KSh ${listing.price}`
                                                    : "Request Quote"}
                                            </span>

                                            <span className="text-gray-500 text-sm">
                                                {listing.views} views
                                            </span>

                                        </div>

                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/services/provider/listings/${listing.id}/edit`
                                                )
                                            }
                                            className="w-full mt-4 border py-2 rounded-lg"
                                        >
                                            Manage
                                        </button>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </section>


                {/* Recent requests */}

                <section className="mt-10">

                    <h2 className="text-2xl font-bold mb-5">
                        Recent Requests
                    </h2>


                    {requests.length === 0 ? (

                        <div className="bg-white border rounded-xl p-8 text-center text-gray-500">
                            No service requests yet.
                        </div>

                    ) : (

                        <div className="bg-white border rounded-xl overflow-hidden">

                            {requests.slice(0, 5).map(
                                request => (

                                    <div
                                        key={request.id}
                                        className="p-5 border-b last:border-b-0"
                                    >

                                        <div className="flex flex-col md:flex-row md:justify-between gap-3">

                                            <div>

                                                <h3 className="font-semibold">
                                                    {request.listing_title}
                                                </h3>

                                                <p className="text-gray-500 text-sm mt-1">
                                                    Customer:{" "}
                                                    {request.customer_name ||
                                                        "Customer"}
                                                </p>

                                                <p className="text-gray-500 text-sm">
                                                    Location:{" "}
                                                    {request.service_location}
                                                </p>

                                            </div>


                                            <span className="self-start px-3 py-1 rounded-full text-sm bg-gray-100">
                                                {request.status}
                                            </span>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}


function StatCard({ title, value }) {

    return (
        <div className="bg-white border rounded-xl p-6">

            <p className="text-gray-500">
                {title}
            </p>

            <p className="text-3xl font-bold mt-2">
                {value}
            </p>

        </div>
    );
}