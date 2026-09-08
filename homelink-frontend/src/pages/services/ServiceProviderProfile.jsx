import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getServiceProvider,
    getProviderListings,
    getProviderReviews,
} from "../../services/servicesApi";


export default function ServiceProviderProfile() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [provider, setProvider] = useState(null);
    const [services, setServices] = useState([]);
    const [reviews, setReviews] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {
        loadProvider();
    }, [id]);


    const loadProvider = async () => {

        try {

            setLoading(true);

            const [
                providerData,
                servicesData,
                reviewsData,
            ] = await Promise.all([
                getServiceProvider(id),
                getProviderListings(id),
                getProviderReviews(id),
            ]);

            setProvider(providerData);

            setServices(
                servicesData.results || servicesData
            );

            setReviews(
                reviewsData.results || reviewsData
            );

        } catch (error) {

            console.error(error);

            setError(
                "Failed to load provider profile."
            );

        } finally {

            setLoading(false);
        }
    };


    if (loading) {

        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading provider...
            </div>
        );
    }


    if (error || !provider) {

        return (
            <div className="min-h-screen flex items-center justify-center">

                <div className="text-center">

                    <h2 className="text-xl font-semibold text-red-600">
                        {error || "Provider not found"}
                    </h2>

                    <button
                        onClick={() =>
                            navigate("/services")
                        }
                        className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg"
                    >
                        Back to Services
                    </button>

                </div>

            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-50">

            {/* Header */}

            <div className="bg-white border-b">

                <div className="max-w-6xl mx-auto px-4 py-5">

                    <button
                        onClick={() =>
                            navigate("/services")
                        }
                        className="text-blue-600 hover:underline"
                    >
                        ← Services Marketplace
                    </button>

                </div>

            </div>


            <main className="max-w-6xl mx-auto px-4 py-8">

                {/* Provider profile */}

                <section className="bg-white border rounded-xl p-6">

                    <div className="flex flex-col md:flex-row gap-6">

                        {/* Avatar */}

                        <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center text-4xl font-bold text-blue-600">

                            {provider.business_name
                                ?.charAt(0)
                                ?.toUpperCase() || "P"}

                        </div>


                        <div className="flex-1">

                            <div className="flex flex-wrap items-center gap-3">

                                <h1 className="text-3xl font-bold">
                                    {provider.business_name}
                                </h1>


                                {provider.verification_status ===
                                    "VERIFIED" && (

                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                        ✓ Verified Provider
                                    </span>

                                )}

                            </div>


                            <p className="text-gray-500 mt-2">
                                {provider.provider_type}
                            </p>


                            <div className="flex flex-wrap gap-5 mt-4">

                                <span>
                                    ⭐{" "}
                                    <strong>
                                        {provider.rating || "New"}
                                    </strong>
                                </span>

                                <span>
                                    🛠️{" "}
                                    <strong>
                                        {provider.completed_jobs || 0}
                                    </strong>{" "}
                                    completed jobs
                                </span>

                                {provider.county && (

                                    <span>
                                        📍 {provider.county}
                                    </span>

                                )}

                            </div>


                            {provider.description && (

                                <p className="text-gray-600 mt-5 leading-7">
                                    {provider.description}
                                </p>

                            )}

                        </div>

                    </div>

                </section>


                {/* Services */}

                <section className="mt-8">

                    <h2 className="text-2xl font-bold mb-5">
                        Services Offered
                    </h2>


                    {services.length === 0 ? (

                        <div className="bg-white border rounded-xl p-8 text-center text-gray-500">
                            No services available.
                        </div>

                    ) : (

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                            {services.map((service) => (

                                <div
                                    key={service.id}
                                    className="bg-white border rounded-xl p-5 hover:shadow-md transition"
                                >

                                    <h3 className="text-lg font-semibold">
                                        {service.title}
                                    </h3>


                                    <p className="text-gray-500 text-sm mt-2 line-clamp-3">
                                        {service.description}
                                    </p>


                                    <div className="flex items-center justify-between mt-5">

                                        <span className="font-bold text-blue-600">
                                            KSh {service.price}
                                        </span>


                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/services/${service.id}`
                                                )
                                            }
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                                        >
                                            View
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </section>


                {/* Reviews */}

                <section className="mt-10">

                    <div className="flex justify-between items-center mb-5">

                        <h2 className="text-2xl font-bold">
                            Customer Reviews
                        </h2>

                        <span className="text-gray-500">
                            {reviews.length} reviews
                        </span>

                    </div>


                    {reviews.length === 0 ? (

                        <div className="bg-white border rounded-xl p-8 text-center text-gray-500">
                            This provider has no reviews yet.
                        </div>

                    ) : (

                        <div className="space-y-4">

                            {reviews.map((review) => (

                                <div
                                    key={review.id}
                                    className="bg-white border rounded-xl p-5"
                                >

                                    <div className="flex justify-between gap-4">

                                        <div>

                                            <p className="font-semibold">
                                                {review.customer_name ||
                                                    "Customer"}
                                            </p>

                                            <p className="text-yellow-500 mt-1">
                                                {"★".repeat(
                                                    review.rating
                                                )}

                                                <span className="text-gray-300">
                                                    {"★".repeat(
                                                        5 -
                                                        review.rating
                                                    )}
                                                </span>
                                            </p>

                                        </div>


                                        <span className="text-sm text-gray-400">
                                            {review.created_at
                                                ? new Date(
                                                    review.created_at
                                                ).toLocaleDateString()
                                                : ""}
                                        </span>

                                    </div>


                                    {review.comment && (

                                        <p className="text-gray-600 mt-4">
                                            {review.comment}
                                        </p>

                                    )}

                                </div>

                            ))}

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}