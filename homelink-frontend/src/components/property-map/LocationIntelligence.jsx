import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000/api";

const icons = {
    SCHOOL: "🏫",
    HOSPITAL: "🏥",
    SUPERMARKET: "🛒",
    POLICE: "👮",
    BUS_STAGE: "🚌",
    CHURCH: "⛪",
    MOSQUE: "🕌",
};

export default function LocationIntelligence({
    latitude,
    longitude,
}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (
            latitude === undefined ||
            longitude === undefined ||
            latitude === null ||
            longitude === null
        ) {
            setLoading(false);
            setError(
                "Property location is not available."
            );
            return;
        }

        async function fetchScore() {
            try {
                const response = await axios.get(
                    `${API}/property-map/location-score/`,
                    {
                        params: {
                            latitude,
                            longitude,
                        },
                    }
                );

                if (response.data.success) {
                    setData(
                        response.data.location
                    );
                } else {
                    setError(
                        "Unable to calculate location score."
                    );
                }
            } catch (err) {
                console.error(err);

                setError(
                    "Unable to load location intelligence."
                );
            } finally {
                setLoading(false);
            }
        }

        fetchScore();
    }, [latitude, longitude]);

    if (loading) {
        return (
            <div className="bg-white border rounded-2xl p-6">
                <p className="text-gray-500">
                    Calculating location score...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white border rounded-2xl p-6">
                <p className="text-gray-500">
                    {error}
                </p>
            </div>
        );
    }

    if (!data) {
        return null;
    }

    return (
        <section className="bg-white border rounded-2xl overflow-hidden">

            <div className="p-6 border-b">

                <h2 className="text-xl font-bold">
                    Location Intelligence
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                    HomeLink location assessment
                </p>

            </div>

            <div className="p-6">

                <div className="flex items-center gap-5 mb-8">

                    <div className="w-24 h-24 rounded-full border-8 flex items-center justify-center">

                        <span className="text-2xl font-bold">
                            {data.score}
                        </span>

                    </div>

                    <div>

                        <h3 className="text-lg font-semibold">
                            Location Score
                        </h3>

                        <p className="text-gray-500 text-sm">
                            Out of 10
                        </p>

                    </div>

                </div>


                <div className="space-y-4">

                    {Object.entries(
                        data.categories
                    ).map(
                        ([
                            category,
                            item,
                        ]) => (

                            <div
                                key={category}
                                className="flex items-center justify-between border-b pb-3"
                            >

                                <div className="flex items-center gap-3">

                                    <span className="text-xl">
                                        {
                                            icons[
                                                category
                                            ] || "📍"
                                        }
                                    </span>

                                    <div>

                                        <p className="font-medium">
                                            {
                                                item.label
                                            }
                                        </p>

                                        <p className="text-xs text-gray-500">
                                            {
                                                item.count
                                            }{" "}
                                            nearby
                                        </p>

                                    </div>

                                </div>


                                <div className="text-right">

                                    {item.nearest_distance_km !==
                                    null ? (
                                        <p className="font-medium">
                                            {
                                                item.nearest_distance_km
                                            }{" "}
                                            km
                                        </p>
                                    ) : (
                                        <p className="text-sm text-gray-400">
                                            None found
                                        </p>
                                    )}

                                </div>

                            </div>

                        )
                    )}

                </div>

            </div>

        </section>
    );
}