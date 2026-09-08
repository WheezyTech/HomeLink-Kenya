import { useState } from "react";
import toast from "react-hot-toast";

import DashboardLayout from "../../layouts/DashboardLayout";
import aiService from "../../services/aiService";

function AIAssistant() {

    const [message, setMessage] = useState("");
    const [answer, setAnswer] = useState("");
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);

    const searchProperties = async (e) => {

        e.preventDefault();

        if (!message.trim()) {
            toast.error("Enter what you are looking for.");
            return;
        }

        try {

            setLoading(true);
            setProperties([]);
            setAnswer("");

            const data = await aiService.smartAssistant(
                message
            );

            setAnswer(data.answer || "");
            setProperties(data.properties || []);

        } catch (error) {

            console.error(error);

            toast.error(
                error?.response?.data?.message ||
                "AI search failed."
            );

        } finally {

            setLoading(false);

        }
    };

    return (

        <DashboardLayout>

            <div className="container py-4">

                <div className="text-center mb-4">

                    <h2 className="fw-bold">
                        🤖 HomeLink AI Assistant
                    </h2>

                    <p className="text-muted">
                        Tell me what kind of property you are looking for.
                    </p>

                </div>

                <div className="card shadow-sm mb-4">

                    <div className="card-body">

                        <form onSubmit={searchProperties}>

                            <div className="input-group">

                                <input
                                    type="text"
                                    className="form-control form-control-lg"
                                    placeholder="e.g. Find me a 2 bedroom house under 30000"
                                    value={message}
                                    onChange={(e) =>
                                        setMessage(e.target.value)
                                    }
                                />

                                <button
                                    type="submit"
                                    className="btn btn-primary px-4"
                                    disabled={loading}
                                >

                                    {loading
                                        ? "Searching..."
                                        : "Search"
                                    }

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

                {answer && (

                    <div className="alert alert-info">

                        <strong>🤖 AI:</strong>{" "}
                        {answer}

                    </div>

                )}

                {properties.length > 0 && (

                    <div>

                        <h4 className="mb-3">
                            Recommended Properties
                        </h4>

                        <div className="row">

                            {properties.map((property) => (

                                <div
                                    className="col-md-6 col-lg-4 mb-4"
                                    key={property.id}
                                >

                                    <div className="card h-100 shadow-sm">

                                        {property.cover_image && (

                                            <img
                                                src={property.cover_image}
                                                className="card-img-top"
                                                alt={property.title}
                                                style={{
                                                    height: "220px",
                                                    objectFit: "cover"
                                                }}
                                            />

                                        )}

                                        <div className="card-body">

                                            <h5 className="card-title">
                                                {property.title}
                                            </h5>

                                            <h6 className="text-primary">
                                                KSh{" "}
                                                {Number(
                                                    property.price
                                                ).toLocaleString()}
                                            </h6>

                                            <p className="text-muted mb-2">
                                                📍{" "}
                                                {property.estate},{" "}
                                                {property.county}
                                            </p>

                                            <p className="mb-2">

                                                🛏️{" "}
                                                {property.bedrooms || 0}
                                                {" "}Bedrooms

                                                {" • "}

                                                🛁{" "}
                                                {property.bathrooms || 0}
                                                {" "}Bathrooms

                                            </p>

                                            <a
                                                href={`/properties/${property.id}`}
                                                className="btn btn-outline-primary w-100"
                                            >
                                                View Property
                                            </a>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>

                )}

                {!loading &&
                    answer &&
                    properties.length === 0 && (

                    <div className="text-center py-5">

                        <h5>
                            No matching properties found.
                        </h5>

                        <p className="text-muted">
                            Try changing your budget,
                            location, or number of bedrooms.
                        </p>

                    </div>

                )}

            </div>

        </DashboardLayout>

    );
}

export default AIAssistant;