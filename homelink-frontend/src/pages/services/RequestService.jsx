import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API = "http://127.0.0.1:8000/api";

export default function RequestService() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        description: "",
        service_location: "",
        county: "",
        preferred_date: "",
        preferred_time: "",
        budget: "",
        customer_phone: "",
    });

    const token = localStorage.getItem("access_token");

    useEffect(() => {
        loadListing();
    }, [id]);

    async function loadListing() {
        try {
            const response = await axios.get(
                `${API}/services/listings/${id}/`
            );

            setListing(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setSubmitting(true);

        try {
            await axios.post(
                `${API}/services/requests/`,
                {
                    listing: id,
                    description: form.description,
                    service_location: form.service_location,
                    county: form.county,
                    preferred_date: form.preferred_date,
                    preferred_time:
                        form.preferred_time || null,
                    budget:
                        form.budget || null,
                    customer_phone: form.customer_phone,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert(
                "Service request sent successfully."
            );

            navigate("/services/my-requests");

        } catch (error) {
            console.error(error);

            const data = error.response?.data;

            alert(
                data?.detail ||
                data?.message ||
                "Unable to submit service request."
            );
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading service...
            </div>
        );
    }

    if (!listing) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Service not found.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">

            <div className="max-w-3xl mx-auto">

                <button
                    onClick={() =>
                        navigate(
                            `/services/${id}`
                        )
                    }
                    className="text-blue-600 mb-6"
                >
                    ← Back to Service
                </button>

                <div className="bg-white rounded-xl border p-6 mb-6">

                    <h1 className="text-2xl font-bold">
                        Request This Service
                    </h1>

                    <p className="text-gray-500 mt-2">
                        {listing.title}
                    </p>

                    <p className="text-blue-600 font-semibold mt-3">
                        {listing.price
                            ? `KSh ${listing.price}`
                            : "Request Quote"}
                    </p>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white border rounded-xl p-6 space-y-5"
                >

                    <div>
                        <label className="block font-medium mb-2">
                            Describe what you need
                        </label>

                        <textarea
                            name="description"
                            rows="5"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Explain the work you need..."
                            className="w-full border rounded-lg p-3"
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-2">
                            Service location
                        </label>

                        <input
                            name="service_location"
                            value={form.service_location}
                            onChange={handleChange}
                            placeholder="Estate, building or exact location"
                            className="w-full border rounded-lg p-3"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-2">
                            County
                        </label>

                        <input
                            name="county"
                            value={form.county}
                            onChange={handleChange}
                            placeholder="e.g. Uasin Gishu"
                            className="w-full border rounded-lg p-3"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div>
                            <label className="block font-medium mb-2">
                                Preferred date
                            </label>

                            <input
                                type="date"
                                name="preferred_date"
                                value={form.preferred_date}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-2">
                                Preferred time
                            </label>

                            <input
                                type="time"
                                name="preferred_time"
                                value={form.preferred_time}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                            />
                        </div>

                    </div>

                    <div>
                        <label className="block font-medium mb-2">
                            Your budget
                        </label>

                        <input
                            type="number"
                            name="budget"
                            value={form.budget}
                            onChange={handleChange}
                            placeholder="KSh"
                            className="w-full border rounded-lg p-3"
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-2">
                            Phone number
                        </label>

                        <input
                            type="tel"
                            name="customer_phone"
                            value={form.customer_phone}
                            onChange={handleChange}
                            placeholder="07XXXXXXXX"
                            className="w-full border rounded-lg p-3"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
                    >
                        {submitting
                            ? "Sending Request..."
                            : "Send Service Request"}
                    </button>

                </form>

            </div>

        </div>
    );
}