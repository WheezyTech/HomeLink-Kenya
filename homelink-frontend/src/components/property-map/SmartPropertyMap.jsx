import { useEffect, useState } from "react";
import {
    MapContainer,
    Marker,
    Popup,
    TileLayer,
    Polyline,
    useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import decodePolyline from "./decodePolyline";

const API = "http://127.0.0.1:8000/api";

const propertyIcon = new L.Icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
});

const categoryIcons = {
    SCHOOL: "🏫",
    HOSPITAL: "🏥",
    SUPERMARKET: "🛒",
    POLICE: "👮",
    BUS_STAGE: "🚌",
    CHURCH: "⛪",
    MOSQUE: "🕌",
};

function RecenterMap({
    latitude,
    longitude,
}) {
    const map = useMap();

    useEffect(() => {
        map.setView(
            [latitude, longitude],
            14
        );
    }, [
        latitude,
        longitude,
        map,
    ]);

    return null;
}

function createPlaceIcon(category) {
    return L.divIcon({
        className: "",
        html: `
            <div style="
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background: white;
                border: 2px solid #2563eb;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                box-shadow: 0 2px 6px rgba(0,0,0,0.25);
            ">
                ${categoryIcons[category] || "📍"}
            </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18],
    });
}

function getTrafficStatus(route) {
    if (!route?.duration_in_traffic_seconds || !route?.duration_seconds) {
        return null;
    }

    const normal = route.duration_seconds;
    const traffic = route.duration_in_traffic_seconds;

    const increase = ((traffic - normal) / normal) * 100;

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

export default function SmartPropertyMap({
    latitude,
    longitude,
    title = "Property location",
}) {
    const parsedLatitude = Number(latitude);
    const parsedLongitude = Number(longitude);

    const [places, setPlaces] = useState([]);
    const [loadingPlaces, setLoadingPlaces] =
        useState(false);
    const [placesError, setPlacesError] =
        useState("");

    const [selectedCategory, setSelectedCategory] =
        useState("ALL");
    const [route, setRoute] = useState(null);
    const [routeLoading, setRouteLoading] = useState(false);
    const [routeError, setRouteError] = useState("");
    const [userLocation, setUserLocation] = useState(null);

    const routeCoordinates =
        route?.route?.overview_polyline
            ? decodePolyline(route.route.overview_polyline)
            : [];
    const trafficStatus = getTrafficStatus(route?.route);

    async function getRoute() {
        setRouteLoading(true);
        setRouteError("");

        if (!navigator.geolocation) {
            setRouteError(
                "Your browser does not support location services."
            );
            setRouteLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const userLatitude = position.coords.latitude;
                    const userLongitude = position.coords.longitude;

                    setUserLocation([userLatitude, userLongitude]);

                    const response = await fetch(
                        `${API}/property-map/directions/?` +
                        `origin_latitude=${userLatitude}` +
                        `&origin_longitude=${userLongitude}` +
                        `&destination_latitude=${parsedLatitude}` +
                        `&destination_longitude=${parsedLongitude}` +
                        `&mode=driving`
                    );

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(
                            data?.message || "Unable to calculate route."
                        );
                    }

                    if (!data.success) {
                        setRouteError(
                            data.message || "Route is not available."
                        );
                        setRoute(null);
                        return;
                    }

                    setRoute(data);
                } catch (error) {
                    console.error(error);

                    setRouteError(
                        error.message || "Unable to calculate route."
                    );
                } finally {
                    setRouteLoading(false);
                }
            },
            () => {
                setRouteError(
                    "Please allow location access to calculate directions."
                );
                setRouteLoading(false);
            }
        );
    }

    useEffect(() => {
        if (
            !Number.isFinite(parsedLatitude) ||
            !Number.isFinite(parsedLongitude)
        ) {
            return;
        }

        async function loadNearbyPlaces() {
            setLoadingPlaces(true);
            setPlacesError("");

            try {
                const response = await fetch(
                    `${API}/property-map/nearby/?latitude=${parsedLatitude}&longitude=${parsedLongitude}&radius=5000`
                );

                const data =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        data?.message ||
                        "Unable to load nearby places."
                    );
                }

                if (data.success) {
                    setPlaces(
                        data.results || []
                    );
                } else {
                    setPlacesError(
                        data.message ||
                        "No nearby places found."
                    );
                }
            } catch (error) {
                console.error(error);

                setPlacesError(
                    "Unable to load nearby places."
                );
            } finally {
                setLoadingPlaces(false);
            }
        }

        loadNearbyPlaces();

    }, [
        parsedLatitude,
        parsedLongitude,
    ]);

    if (
        !Number.isFinite(parsedLatitude) ||
        !Number.isFinite(parsedLongitude)
    ) {
        return (
            <div className="border rounded-3 overflow-hidden bg-white">

                <div className="p-3 border-bottom bg-light">

                    <h5 className="mb-1">
                        Location
                    </h5>

                    <p className="text-muted mb-0">
                        Map location is not available
                        for this property.
                    </p>

                </div>

                <div className="p-4 text-muted">
                    No coordinates were provided.
                </div>

            </div>
        );
    }

    const filteredPlaces =
        selectedCategory === "ALL"
            ? places
            : places.filter(
                  (place) =>
                      place.place_type ===
                      selectedCategory
              );

    const categories = [
        {
            value: "ALL",
            label: "All",
            icon: "📍",
        },
        {
            value: "SCHOOL",
            label: "Schools",
            icon: "🏫",
        },
        {
            value: "HOSPITAL",
            label: "Hospitals",
            icon: "🏥",
        },
        {
            value: "SUPERMARKET",
            label: "Supermarkets",
            icon: "🛒",
        },
        {
            value: "POLICE",
            label: "Police",
            icon: "👮",
        },
        {
            value: "BUS_STAGE",
            label: "Bus",
            icon: "🚌",
        },
        {
            value: "CHURCH",
            label: "Churches",
            icon: "⛪",
        },
        {
            value: "MOSQUE",
            label: "Mosques",
            icon: "🕌",
        },
    ];

    return (
        <div className="border rounded-3 overflow-hidden bg-white">

            {/* Header */}

            <div className="p-3 border-bottom bg-light">

                <h5 className="mb-1">
                    Smart Property Map
                </h5>

                <p className="text-muted mb-0">
                    Explore the surrounding area
                    from this property.
                </p>

            </div>

            {/* Category filters */}

            <div
                className="p-3 border-bottom"
                style={{
                    overflowX: "auto",
                }}
            >

                <div
                    className="d-flex gap-2"
                    style={{
                        minWidth: "max-content",
                    }}
                >

                    {categories.map(
                        (category) => (

                            <button
                                key={
                                    category.value
                                }
                                type="button"
                                onClick={() =>
                                    setSelectedCategory(
                                        category.value
                                    )
                                }
                                className={
                                    `btn btn-sm ${
                                        selectedCategory ===
                                        category.value
                                            ? "btn-primary"
                                            : "btn-outline-secondary"
                                    }`
                                }
                            >
                                {category.icon}{" "}
                                {category.label}
                            </button>

                        )
                    )}

                </div>

            </div>

            <div className="p-3 border-bottom">

                <button
                    type="button"
                    onClick={getRoute}
                    disabled={routeLoading}
                    className="btn btn-primary"
                >
                    {routeLoading
                        ? "Calculating route..."
                        : "🧭 Get Directions"}
                </button>

            </div>

            {/* Map */}

            <div style={{ height: 420 }}>

                <MapContainer
                    center={[
                        parsedLatitude,
                        parsedLongitude,
                    ]}
                    zoom={14}
                    scrollWheelZoom
                    className="h-100 w-100"
                >

                    <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {route?.route?.overview_polyline && (
                        <Polyline
                            positions={decodePolyline(
                                route.route.overview_polyline
                            )}
                            color="#2563eb"
                            weight={5}
                        />
                    )}

                    <RecenterMap
                        latitude={
                            parsedLatitude
                        }
                        longitude={
                            parsedLongitude
                        }
                    />

                    {/* Property */}

                    <Marker
                        position={[
                            parsedLatitude,
                            parsedLongitude,
                        ]}
                        icon={propertyIcon}
                    >

                        <Popup>

                            <div>

                                <strong>
                                    {title}
                                </strong>

                                <p className="mb-0 mt-1">
                                    Property location
                                </p>

                            </div>

                        </Popup>

                    </Marker>

                    {userLocation && (
                        <Marker position={userLocation}>
                            <Popup>
                                <strong>
                                    Your current location
                                </strong>
                            </Popup>
                        </Marker>
                    )}

                    {routeCoordinates.length > 0 && (
                        <Polyline
                            positions={routeCoordinates}
                            pathOptions={{
                                color: "#2563eb",
                                weight: 5,
                                opacity: 0.8,
                            }}
                        />
                    )}

                    {/* Nearby places */}

                    {filteredPlaces.map(
                        (place) => {

                            const placeLatitude =
                                Number(
                                    place.latitude
                                );

                            const placeLongitude =
                                Number(
                                    place.longitude
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
                                        place.id
                                    }
                                    position={[
                                        placeLatitude,
                                        placeLongitude,
                                    ]}
                                    icon={createPlaceIcon(
                                        place.place_type
                                    )}
                                >

                                    <Popup>

                                        <div>

                                            <strong>
                                                {
                                                    place.name
                                                }
                                            </strong>

                                            <p className="mb-1 mt-1 text-muted">
                                                {
                                                    categoryIcons[
                                                        place.place_type
                                                    ]
                                                }{" "}
                                                {
                                                    place.place_type
                                                }
                                            </p>

                                            {place.address && (
                                                <p className="mb-1">
                                                    {
                                                        place.address
                                                    }
                                                </p>
                                            )}

                                            {place.distance_km !=
                                                null && (
                                                <small className="text-muted">
                                                    {
                                                        place.distance_km
                                                    }{" "}
                                                    km away
                                                </small>
                                            )}

                                        </div>

                                    </Popup>

                                </Marker>
                            );
                        }
                    )}

                </MapContainer>

            </div>

            {route?.route && (
                <div className="p-3 border-top">

                    <div className="row g-3">

                        <div className="col-md-4">
                            <div className="p-3 bg-light rounded">
                                <small className="text-muted">
                                    Distance
                                </small>

                                <div className="fw-bold">
                                    {route.route.distance}
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="p-3 bg-light rounded">
                                <small className="text-muted">
                                    Travel time
                                </small>

                                <div className="fw-bold">
                                    {route.route.duration}
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="p-3 bg-light rounded">
                                <small className="text-muted">
                                    Traffic
                                </small>

                                <div className="fw-bold">
                                    {route.route.duration_in_traffic || "Not available"}
                                </div>
                            </div>
                        </div>

                    </div>

                    {trafficStatus && (
                        <div className="mt-3 p-3 rounded bg-light">

                            <div className="fw-bold">
                                {trafficStatus.icon}{" "}
                                {trafficStatus.label}
                            </div>

                            {route?.route?.duration_in_traffic && (
                                <small className="text-muted">
                                    Estimated travel time with traffic: {" "}
                                    {route.route.duration_in_traffic}
                                </small>
                            )}

                        </div>
                    )}

                </div>
            )}

            {routeError && (
                <div className="p-3 text-danger">
                    {routeError}
                </div>
            )}

            {/* Status */}

            <div className="p-3">

                {loadingPlaces && (
                    <p className="text-muted mb-0">
                        Loading nearby places...
                    </p>
                )}

                {!loadingPlaces &&
                    placesError && (
                        <p className="text-danger mb-0">
                            {placesError}
                        </p>
                    )}

                {!loadingPlaces &&
                    !placesError && (
                        <p className="text-muted mb-0">
                            {filteredPlaces.length}{" "}
                            nearby place
                            {filteredPlaces.length ===
                            1
                                ? ""
                                : "s"}{" "}
                            displayed
                        </p>
                    )}

            </div>

        </div>
    );
}