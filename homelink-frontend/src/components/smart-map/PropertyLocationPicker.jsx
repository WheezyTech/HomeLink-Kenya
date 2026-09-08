import { useEffect, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    useMap,
    useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
    GeoSearchControl,
    OpenStreetMapProvider,
} from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";

const markerIcon = new L.Icon({
    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

function SearchControl({ onLocationChange }) {

    const map = useMap();

    useEffect(() => {

        const provider = new OpenStreetMapProvider();

        const search = new GeoSearchControl({
            provider,
            style: "bar",
            autoComplete: true,
            autoCompleteDelay: 300,
            showMarker: true,
            retainZoomLevel: false,
        });

        map.addControl(search);

        map.on("geosearch/showlocation", (result) => {

            onLocationChange([
                result.location.y,
                result.location.x,
            ]);

        });

        return () => {
            map.removeControl(search);
        };

    }, [map, onLocationChange]);

    return null;
}

function LocationMarker({ position, setPosition }) {

    useMapEvents({
        click(event) {

            setPosition([
                event.latlng.lat,
                event.latlng.lng,
            ]);

        },
    });

    if (!position) {
        return null;
    }

    return (
        <Marker
            position={position}
            icon={markerIcon}
        />
    );
}

export default function PropertyLocationPicker({
    latitude,
    longitude,
    onLocationChange,
}) {

    const initialPosition =
        latitude && longitude
            ? [
                Number(latitude),
                Number(longitude),
            ]
            : [-0.5143, 35.2698];

    const [position, setPosition] =
        useState(initialPosition);

    useEffect(() => {
        setPosition(initialPosition);
    }, [latitude, longitude]);

    function handleLocationChange(
        newPosition
    ) {

        setPosition(newPosition);

        onLocationChange({
            latitude: newPosition[0],
            longitude: newPosition[1],
        });
    }

    function useCurrentLocation() {

        if (!navigator.geolocation) {
            alert("Geolocation not supported.");
            return;
        }

        navigator.geolocation.getCurrentPosition(

            (position) => {

                handleLocationChange([
                    position.coords.latitude,
                    position.coords.longitude,
                ]);

            },

            () => {
                alert("Unable to get your location.");
            }

        );
    }

    return (
        <div className="space-y-4">

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

                <div>

                    <h3 className="text-lg font-bold">
                        Property Location
                    </h3>

                    <p className="text-sm text-gray-500">
                        Click on the map to select the
                        exact property location.
                    </p>

                </div>

                <button
                    type="button"
                    onClick={useCurrentLocation}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                    📍 Use My Current Location
                </button>

            </div>

            <div className="h-[400px] rounded-xl overflow-hidden border">

                <MapContainer
                    center={position}
                    zoom={14}
                    scrollWheelZoom={true}
                    className="h-full w-full"
                >

                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <SearchControl
                        onLocationChange={
                            handleLocationChange
                        }
                    />

                    <LocationMarker
                        position={position}
                        setPosition={
                            handleLocationChange
                        }
                    />

                </MapContainer>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="bg-gray-50 rounded-lg p-4">

                    <p className="text-sm text-gray-500">
                        Latitude
                    </p>

                    <p className="font-semibold mt-1">
                        {position[0].toFixed(7)}
                    </p>

                </div>

                <div className="bg-gray-50 rounded-lg p-4">

                    <p className="text-sm text-gray-500">
                        Longitude
                    </p>

                    <p className="font-semibold mt-1">
                        {position[1].toFixed(7)}
                    </p>

                </div>

            </div>

        </div>
    );
}