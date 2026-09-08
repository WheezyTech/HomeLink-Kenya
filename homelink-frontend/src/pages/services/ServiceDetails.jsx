import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getServiceListing,
    createServiceRequest,
} from "../../services/servicesApi";


export default function ServiceDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showHireForm, setShowHireForm] = useState(false);

    const [form, setForm] = useState({
        description: "",
        location: "",
        preferred_date: "",
        budget: "",
    });

    const [submitting, setSubmitting] = useState(false);


    useEffect(() => {
        loadService();
    }, [id]);


    const loadService = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getServiceListing(id);

            setService(data);

        } catch (error) {

            console.error(error);

            setError(
                "Unable to load this service."
            );

        } finally {

            setLoading(false);
        }
    };


    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };


    const handleHire = async (e) => {

        e.preventDefault();

        try {

            setSubmitting(true);

            await createServiceRequest({
                listing: service.id,
                description: form.description,
                location: form.location,
                preferred_date: form.preferred_date,
                budget: form.budget || null,
            });

            alert(
                "Your service request has been sent successfully."
            );

            navigate("/services/requests");

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.detail ||
                "Failed to submit service request."
            );

        } finally {

            setSubmitting(false);
        }
    };


    if (loading) {

        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading service...
            </div>
        );
    }


    if (error || !service) {

        return (
            <div className="min-h-screen flex items-center justify-center">

                <div className="text-center">

                    <h2 className="text-xl font-semibold text-red-600">
                        {error || "Service not found"}
                    </h2>

                    <button
                        onClick={() => navigate("/services")}
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
                        onClick={() => navigate("/services")}
                        className="text-blue-600 hover:underline"
                    >
                        ← Back to Services
                    </button>

                </div>

            </div>


            <main className="max-w-6xl mx-auto px-4 py-8">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">


                    {/* Images */}

                    <div>

                        <div className="bg-gray-200 rounded-xl overflow-hidden h-96">

                            {service.images?.length > 0 ? (

                                <img
                                    src={service.images[0].image}
                                    alt={service.title}
                                    className="w-full h-full object-cover"
                                />

                            ) : (

                                <div className="h-full flex items-center justify-center text-gray-400">
                                    No image available
                                </div>

                            )}

                        </div>


                        {service.images?.length > 1 && (

                            <div className="grid grid-cols-4 gap-3 mt-3">

                                {service.images.slice(0, 4).map(
                                    (image) => (

                                        <img
                                            key={image.id}
                                            src={image.image}
                                            alt=""
                                            className="h-20 w-full object-cover rounded-lg"
                                        />

                                    )
                                )}

                            </div>

                        )}

                    </div>


                    {/* Information */}

                    <div>

                        <div className="flex items-start justify-between gap-4">

                            <div>

                                <h1 className="text-3xl font-bold text-gray-900">
                                    {service.title}
                                </h1>

                                <p className="text-gray-500 mt-2">
                                    {service.category_name}
                                </p>

                            </div>


                            {service.provider_verified && (

                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                    ✓ Verified
                                </span>

                            )}

                        </div>


                        <div className="mt-6">

                            <span className="text-3xl font-bold text-blue-600">
                                KSh {service.price}
                            </span>

                        </div>


                        <div className="mt-6 border-t pt-6">

                            <h2 className="font-semibold text-lg">
                                About this service
                            </h2>

                            <p className="text-gray-600 mt-3 leading-7">
                                {service.description}
                            </p>

                        </div>


                        {/* Provider */}

                        <div className="mt-6 bg-white border rounded-xl p-5">

                            <h2 className="font-semibold">
                                Service Provider
                            </h2>

                            <p className="text-lg font-medium mt-2">
                                {service.provider_name}
                            </p>

                            {service.provider_rating && (

                                <p className="text-gray-600 mt-1">
                                    ⭐ {service.provider_rating}
                                </p>

                            )}

                            {service.county && (

                                <p className="text-gray-500 mt-1">
                                    📍 {service.county}
                                </p>

                            )}

                        </div>


                        {/* Hire button */}

                        {!showHireForm && (

                            <button
                                onClick={() =>
                                    navigate(
                                        `/services/${service?.id}/request`
                                    )
                                }
                                className="w-full mt-6 bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700"
                            >
                                Request This Service
                            </button>

                        )}


                        {/* Hire form */}

                        {showHireForm && (

                            <form
                                onSubmit={handleHire}
                                className="mt-6 bg-white border rounded-xl p-6"
                            >

                                <h2 className="text-xl font-semibold">
                                    Request This Service
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Tell the provider what you need.
                                </p>


                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    required
                                    rows="4"
                                    placeholder="Describe the work you need..."
                                    className="w-full mt-5 border rounded-lg px-4 py-3"
                                />


                                <input
                                    type="text"
                                    name="location"
                                    value={form.location}
                                    onChange={handleChange}
                                    required
                                    placeholder="Service location"
                                    className="w-full mt-4 border rounded-lg px-4 py-3"
                                />


                                <label className="block text-sm text-gray-600 mt-4">
                                    Preferred date
                                </label>

                                <input
                                    type="date"
                                    name="preferred_date"
                                    value={form.preferred_date}
                                    onChange={handleChange}
                                    required
                                    className="w-full mt-1 border rounded-lg px-4 py-3"
                                />


                                <input
                                    type="number"
                                    name="budget"
                                    value={form.budget}
                                    onChange={handleChange}
                                    placeholder="Your budget (optional)"
                                    className="w-full mt-4 border rounded-lg px-4 py-3"
                                />


                                <div className="flex gap-3 mt-6">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowHireForm(false)
                                        }
                                        className="flex-1 border py-3 rounded-lg"
                                    >
                                        Cancel
                                    </button>


                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1 bg-blue-600 text-white py-3 rounded-lg disabled:opacity-50"
                                    >
                                        {submitting
                                            ? "Sending..."
                                            : "Send Request"}
                                    </button>

                                </div>

                            </form>

                        )}

                    </div>

                </div>

            </main>

        </div>
    );
}