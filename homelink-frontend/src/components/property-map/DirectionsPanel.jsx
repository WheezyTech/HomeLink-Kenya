import { useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000/api";

const travelModes = [
    ["driving", "🚗", "Driving"],
    ["walking", "🚶", "Walking"],
    ["bicycling", "🚲", "Cycling"],
    ["transit", "🚌", "Transit"],
];

export default function DirectionsPanel({
    latitude,
    longitude,
}) {
    const [mode, setMode] = useState("driving");
    const [origin, setOrigin] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function getCurrentLocation() {
        setError("");

        if (!navigator.geolocation) {
            setError(
                "Your browser does not support location services."
            );
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setOrigin({
                    latitude:
                        position.coords.latitude,
                    longitude:
                        position.coords.longitude,
                });
            },
            () => {
                setError(
                    "Unable to access your current location. "
                    + "Please allow location access."
                );
            }
        );
    }

    async function getDirections() {
        if (!origin) {
            setError(
                "Please allow access to your current location first."
            );
            return;
        }

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const response = await axios.get(
                `${API}/property-map/directions/`,
                {
                    params: {
                        origin_latitude:
                            origin.latitude,

                        origin_longitude:
                            origin.longitude,

                        destination_latitude:
                            latitude,

                        destination_longitude:
                            longitude,

                        mode,
                    },
                }
            );

            if (response.data.success) {
                setResult(response.data);
            } else {
                setError(
                    response.data.message ||
                    "Unable to calculate route."
                );
            }

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to calculate directions."
            );
        } finally {
            setLoading(false);
        }
    }

    function getTrafficStatus(route) {
        if (
            !route.duration_in_traffic_seconds ||
            !route.duration_seconds
        ) {
            return null;
        }

        const normal =
            route.duration_seconds;

        const traffic =
            route.duration_in_traffic_seconds;

        const increase =
            ((traffic - normal) / normal) * 100;

        if (increase <= 10) {
            return {
                label: "Light traffic",
                icon: "🟢",
            };
        }

        if (increase <= 30) {
            return {
                label: "Moderate traffic",
                icon: "🟡",
            };
        }

        return {
            label: "Heavy traffic",
            icon: "🔴",
        };
    }

    const route = result?.route;

    const trafficStatus =
        route
            ? getTrafficStatus(route)
            : null;

    return (
        <section className="bg-white border rounded-2xl overflow-hidden mt-8">

            <div className="p-6 border-b">

                <h2 className="text-xl font-bold">
                    Get Directions
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                    Find the best route from your
                    current location to this property.
                </p>

            </div>

            <div className="p-6">

                {/* Travel mode */}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

                    {travelModes.map(
                        ([value, icon, label]) => (

                            <button
                                key={value}
                                type="button"
                                onClick={() => {
                                    setMode(value);
                                    setResult(null);
                                    setError("");
                                }}
                                className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${
                                    mode === value
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-white text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                                <span className="mr-1">
                                    {icon}
                                </span>

                                {label}
                            </button>

                        )
                    )}

                </div>

                {/* Location button */}

                {!origin && (

                    <button
                        type="button"
                        onClick={getCurrentLocation}
                        className="mt-5 w-full rounded-xl bg-gray-900 text-white py-3 font-medium hover:bg-gray-800"
                    >
                        📍 Use My Current Location
                    </button>

                )}

                {origin && (

                    <div className="mt-5">

                        <div className="flex items-center justify-between mb-3">

                            <p className="text-sm text-green-600">
                                ✓ Current location detected
                            </p>

                            <button
                                type="button"
                                onClick={getCurrentLocation}
                                className="text-sm text-blue-600"
                            >
                                Update location
                            </button>

                        </div>

                        <button
                            type="button"
                            onClick={getDirections}
                            disabled={loading}
                            className="w-full rounded-xl bg-blue-600 text-white py-3 font-medium hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading
                                ? "Calculating route..."
                                : "🧭 Get Directions"}
                        </button>

                    </div>

                )}

                {/* Error */}

                {error && (

                    <div className="mt-5 rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-600">
                        {error}
                    </div>

                )}

                {/* Route result */}

                {route && (

                    <div className="mt-6">

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                            {/* Distance */}

                            <div className="rounded-xl bg-gray-50 p-4">

                                <p className="text-xs text-gray-500">
                                    Distance
                                </p>

                                <p className="text-lg font-bold mt-1">
                                    {route.distance}
                                </p>

                            </div>

                            {/* Duration */}

                            <div className="rounded-xl bg-gray-50 p-4">

                                <p className="text-xs text-gray-500">
                                    Travel time
                                </p>

                                <p className="text-lg font-bold mt-1">
                                    {route.duration}
                                </p>

                            </div>

                            {/* Traffic */}

                            <div className="rounded-xl bg-gray-50 p-4">

                                <p className="text-xs text-gray-500">
                                    Traffic
                                </p>

                                {trafficStatus ? (

                                    <>
                                        <p className="text-lg font-bold mt-1">
                                            {trafficStatus.icon}{" "}
                                            {trafficStatus.label}
                                        </p>

                                        <p className="text-xs text-gray-500 mt-1">
                                            {
                                                route.duration_in_traffic
                                            }
                                        </p>
                                    </>

                                ) : (

                                    <p className="text-lg font-bold mt-1">
                                        Not available
                                    </p>

                                )}

                            </div>

                        </div>

                        {/* Addresses */}

                        <div className="mt-5 space-y-3">

                            <div className="flex gap-3">

                                <span>📍</span>

                                <div>
                                    <p className="text-xs text-gray-500">
                                        From
                                    </p>

                                    <p className="text-sm font-medium">
                                        {
                                            route.start_address
                                        }
                                    </p>
                                </div>

                            </div>

                            <div className="flex gap-3">

                                <span>🏠</span>

                                <div>
                                    <p className="text-xs text-gray-500">
                                        Destination
                                    </p>

                                    <p className="text-sm font-medium">
                                        {
                                            route.end_address
                                        }
                                    </p>
                                </div>

                            </div>

                        </div>

                        {/* Turn by turn */}

                        {route.steps?.length > 0 && (

                            <div className="mt-6">

                                <h3 className="font-semibold mb-4">
                                    Directions
                                </h3>

                                <div className="space-y-3">

                                    {route.steps.map(
                                        (step, index) => (

                                            <div
                                                key={index}
                                                className="flex gap-3 border-b pb-3"
                                            >

                                                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                                                    {index + 1}
                                                </div>

                                                <div>

                                                    <p
                                                        className="text-sm"
                                                        dangerouslySetInnerHTML={{
                                                            __html:
                                                                step.instruction,
                                                        }}
                                                    />

                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {
                                                            step.distance
                                                        }{" "}
                                                        ·{" "}
                                                        {
                                                            step.duration
                                                        }
                                                    </p>

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>

                        )}

                    </div>

                )}

            </div>

        </section>
    );
}