import { useEffect, useState } from "react";
import axios from "axios";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
} from "react-leaflet";
import L from "leaflet";

const API = "http://127.0.0.1:8000/api";

const categories = [
    { key: "schools", label: "Schools", icon: "🏫" },
    { key: "hospitals", label: "Hospitals", icon: "🏥" },
    { key: "supermarkets", label: "Supermarkets", icon: "🛒" },
    { key: "police", label: "Police", icon: "👮" },
    { key: "churches", label: "Churches", icon: "⛪" },
    { key: "mosques", label: "Mosques", icon: "🕌" },
    { key: "bus_stages", label: "Bus Stages", icon: "🚌" },
];

const propertyIcon = new L.Icon({
    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const placeIcon = new L.Icon({
    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

function RecenterMap({ latitude, longitude }) {
    const map = useMap();

    useEffect(() => {
        map.setView(
            [latitude, longitude],
            14
        );
    }, [latitude, longitude, map]);

    return null;
}

export default function SmartPropertyMap({
    propertyId,
}) {
    const [data, setData] = useState(null);
    const [activeCategory, setActiveCategory] =
        useState("schools");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token =
        localStorage.getItem("access_token");

    async function loadMapData() {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `${API}/smart-map/property/${propertyId}/`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            setData(response.data);
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to load property map."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadMapData();
    }, [propertyId]);

    if (loading) {
        return (
            <div className="bg-white border rounded-2xl p-10 text-center">
                <div className="text-4xl">
                    🗺️
                </div>

                <p className="font-semibold mt-3">
                    Loading Smart Map...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white border rounded-2xl p-8 text-center">

                <p className="text-red-600 font-semibold">
                    {error}
                </p>

                <button
                    onClick={loadMapData}
                    className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg"
                >
                    Try Again
                </button>

            </div>
        );
    }

    if (!data) {
        return null;
    }

    const latitude =
        Number(data.property.latitude);

    const longitude =
        Number(data.property.longitude);

    const places =
        data.nearby?.[activeCategory] || [];

    return (
        <section className="bg-white border rounded-2xl overflow-hidden">

            <div className="p-6 border-b">

                <div className="flex flex-col md:flex-row md:justify-between gap-4">

                    <div>
                        <h2 className="text-2xl font-bold">
                            Smart Property Map
                        </h2>

                        <p className="text-gray-500 mt-1">
                            Explore facilities and
                            services around this property.
                        </p>
                    </div>

                    <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm">
                        📍 5 km radius
                    </div>

                </div>

            </div>


            <div className="p-4 border-b overflow-x-auto">

                <div className="flex gap-2 min-w-max">

                    {categories.map(
                        (category) => (

                            <button
                                key={
                                    category.key
                                }
                                onClick={() =>
                                    setActiveCategory(
                                        category.key
                                    )
                                }
                                className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium ${
                                    activeCategory ===
                                    category.key
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-700"
                                }`}
                            >
                                <span>
                                    {category.icon}
                                </span>

                                {category.label}

                            </button>

                        )
                    )}

                </div>

            </div>


            {/* REAL DEVELOPMENT MAP */}

            <div className="h-[450px]">

                <MapContainer
                    center={[
                        latitude,
                        longitude,
                    ]}
                    zoom={14}
                    scrollWheelZoom={true}
                    className="h-full w-full"
                >

                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <RecenterMap
                        latitude={latitude}
                        longitude={longitude}
                    />

                    <Marker
                        position={[
                            latitude,
                            longitude,
                        ]}
                        icon={propertyIcon}
                    >

                        <Popup>

                            <div>
                                <strong>
                                    {data.property.title}
                                </strong>

                                <p className="text-sm mt-1">
                                    Property location
                                </p>
                            </div>

                        </Popup>

                    </Marker>


                    {places.map(
                        (place) => {

                            const placeLatitude =
                                Number(
                                    place.geometry
                                        ?.location?.lat
                                );

                            const placeLongitude =
                                Number(
                                    place.geometry
                                        ?.location?.lng
                                );

                            if (
                                !Number.isFinite(
                                    placeLatitude
                                ) ||
                                !Number.isFinite(
                                    placeLongitude
                                )
                            ) {
                                return null;
                            }

                            return (
                                <Marker
                                    key={
                                        place.place_id
                                    }
                                    position={[
                                        placeLatitude,
                                        placeLongitude,
                                    ]}
                                    icon={placeIcon}
                                >

                                    <Popup>

                                        <div>

                                            <strong>
                                                {
                                                    place.name
                                                }
                                            </strong>

                                            <p className="text-sm mt-1">
                                                {
                                                    place.vicinity
                                                }
                                            </p>

                                            {place.distance_km !==
                                                undefined && (

                                                <p className="text-sm text-blue-600 mt-1">
                                                    📍{" "}
                                                    {
                                                        place.distance_km
                                                    }{" "}
                                                    km away
                                                </p>

                                            )}

                                            {place.rating && (

                                                <p className="text-sm mt-1">
                                                    ⭐{" "}
                                                    {
                                                        place.rating
                                                    }
                                                </p>

                                            )}

                                        </div>

                                    </Popup>

                                </Marker>
                            );
                        }
                    )}

                </MapContainer>

            </div>


            {/* NEARBY LIST */}

            <div className="p-6">

                <div className="flex justify-between items-center mb-5">

                    <h3 className="text-lg font-bold">
                        Nearby{" "}
                        {
                            categories.find(
                                item =>
                                    item.key ===
                                    activeCategory
                            )?.label
                        }
                    </h3>

                    <span className="text-sm text-gray-500">
                        {places.length} found
                    </span>

                </div>


                {places.length === 0 ? (

                    <div className="bg-gray-50 rounded-xl p-8 text-center">

                        <p className="text-gray-500">
                            No nearby places found.
                        </p>

                    </div>

                ) : (

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {places.map(
                            (place) => (

                                <div
                                    key={
                                        place.place_id
                                    }
                                    className="border rounded-xl p-4 hover:shadow-md transition"
                                >

                                    <h4 className="font-semibold">
                                        {place.name}
                                    </h4>

                                    <p className="text-sm text-gray-500 mt-1">
                                        {
                                            place.vicinity
                                        }
                                    </p>

                                    <div className="flex gap-4 mt-3 text-sm">

                                        {place.distance_km !==
                                            undefined && (

                                            <span className="text-blue-600">
                                                📍{" "}
                                                {
                                                    place.distance_km
                                                }{" "}
                                                km
                                            </span>

                                        )}

                                        {place.rating && (

                                            <span>
                                                ⭐{" "}
                                                {
                                                    place.rating
                                                }
                                            </span>

                                        )}

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>

        </section>
    );
}