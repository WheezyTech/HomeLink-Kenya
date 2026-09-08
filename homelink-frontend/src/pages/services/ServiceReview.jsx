import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { createServiceReview } from "../../services/servicesApi";


export default function ServiceReview() {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const serviceRequestId =
        searchParams.get("request");


    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");


    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!serviceRequestId) {

            setError(
                "Service request ID is missing."
            );

            return;
        }

        try {

            setSubmitting(true);
            setError("");

            await createServiceReview({
                service_request: serviceRequestId,
                rating,
                comment,
            });

            alert(
                "Thank you! Your review has been submitted."
            );

            navigate("/services/requests");

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                error.response?.data?.detail ||
                "Failed to submit review."
            );

        } finally {

            setSubmitting(false);
        }
    };


    return (
        <div className="min-h-screen bg-gray-50">

            <div className="max-w-xl mx-auto px-4 py-10">

                <button
                    onClick={() =>
                        navigate("/services/requests")
                    }
                    className="text-blue-600 hover:underline"
                >
                    ← My Service Requests
                </button>


                <div className="bg-white border rounded-xl p-6 mt-6">

                    <h1 className="text-2xl font-bold">
                        Rate Your Service
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Tell us about your experience with the service provider.
                    </p>


                    {error && (

                        <div className="mt-5 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                            {error}
                        </div>

                    )}


                    <form
                        onSubmit={handleSubmit}
                        className="mt-6"
                    >

                        <label className="block font-medium">
                            Your Rating
                        </label>


                        <div className="flex gap-2 mt-3">

                            {[1, 2, 3, 4, 5].map(
                                (star) => (

                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() =>
                                            setRating(star)
                                        }
                                        className={`text-4xl transition ${
                                            star <= rating
                                                ? "text-yellow-400"
                                                : "text-gray-300"
                                        }`}
                                    >
                                        ★
                                    </button>

                                )
                            )}

                        </div>


                        <p className="text-sm text-gray-500 mt-2">
                            {rating} out of 5
                        </p>


                        <label className="block font-medium mt-6">
                            Your Review
                        </label>


                        <textarea
                            value={comment}
                            onChange={(e) =>
                                setComment(
                                    e.target.value
                                )
                            }
                            rows="5"
                            placeholder="How was your experience?"
                            className="w-full border rounded-lg px-4 py-3 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />


                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
                        >
                            {submitting
                                ? "Submitting..."
                                : "Submit Review"}
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}