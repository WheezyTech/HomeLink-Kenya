import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000/api";

export default function SavedSearches() {
    const [searches, setSearches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token =
        localStorage.getItem("access_token");

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    async function loadSearches() {
        try {
            setLoading(true);

            const response = await axios.get(
                `${API}/alerts/saved-searches/`,
                { headers }
            );

            setSearches(response.data);

        } catch (error) {
            console.error(error);

            setError(
                "Unable to load saved searches."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadSearches();
    }, []);

    async function toggleSearch(search) {
        try {
            const response = await axios.patch(
                `${API}/alerts/saved-searches/${search.id}/`,
                {
                    is_active: !search.is_active,
                },
                { headers }
            );

            setSearches((current) =>
                current.map((item) =>
                    item.id === search.id
                        ? response.data
                        : item
                )
            );

        } catch (error) {
            console.error(error);
        }
    }

    async function deleteSearch(id) {
        const confirmed = window.confirm(
            "Delete this saved search?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await axios.delete(
                `${API}/alerts/saved-searches/${id}/`,
                { headers }
            );

            setSearches((current) =>
                current.filter(
                    (search) =>
                        search.id !== id
                )
            );

        } catch (error) {
            console.error(error);
        }
    }

    if (loading) {
        return (
            <div className="p-8 text-center">
                Loading saved searches...
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">

            <div className="mb-8">

                <h1 className="text-3xl font-bold">
                    Saved Searches
                </h1>

                <p className="text-gray-500 mt-2">
                    Get notified when properties
                    matching your requirements are
                    added.
                </p>

            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {searches.length === 0 ? (

                <div className="bg-white border rounded-2xl p-12 text-center">

                    <div className="text-5xl">
                        🔍
                    </div>

                    <h2 className="text-xl font-bold mt-4">
                        No saved searches
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Save a property search to
                        receive alerts for new matching
                        properties.
                    </p>

                </div>

            ) : (

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {searches.map(
                        (search) => (

                            <div
                                key={search.id}
                                className="bg-white border rounded-2xl p-5"
                            >

                                <div className="flex justify-between gap-4">

                                    <div>

                                        <h2 className="font-bold text-lg">
                                            {search.name}
                                        </h2>

                                        <p className="text-sm text-gray-500 mt-1">
                                            {search.location ||
                                                "Any location"}
                                        </p>

                                    </div>

                                    <span
                                        className={`text-xs px-3 py-1 rounded-full h-fit ${
                                            search.is_active
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-500"
                                        }`}
                                    >
                                        {search.is_active
                                            ? "Active"
                                            : "Paused"}
                                    </span>

                                </div>


                                <div className="grid grid-cols-2 gap-3 mt-5">

                                    <div className="bg-gray-50 p-3 rounded-lg">

                                        <p className="text-xs text-gray-500">
                                            Property type
                                        </p>

                                        <p className="font-medium mt-1">
                                            {search.property_type ||
                                                "Any"}
                                        </p>

                                    </div>


                                    <div className="bg-gray-50 p-3 rounded-lg">

                                        <p className="text-xs text-gray-500">
                                            Bedrooms
                                        </p>

                                        <p className="font-medium mt-1">
                                            {search.bedrooms ||
                                                "Any"}
                                        </p>

                                    </div>


                                    <div className="bg-gray-50 p-3 rounded-lg">

                                        <p className="text-xs text-gray-500">
                                            Min price
                                        </p>

                                        <p className="font-medium mt-1">
                                            {search.min_price
                                                ? `KES ${search.min_price}`
                                                : "Any"}
                                        </p>

                                    </div>


                                    <div className="bg-gray-50 p-3 rounded-lg">

                                        <p className="text-xs text-gray-500">
                                            Max price
                                        </p>

                                        <p className="font-medium mt-1">
                                            {search.max_price
                                                ? `KES ${search.max_price}`
                                                : "Any"}
                                        </p>

                                    </div>

                                </div>


                                <div className="flex gap-3 mt-5">

                                    <button
                                        onClick={() =>
                                            toggleSearch(
                                                search
                                            )
                                        }
                                        className="flex-1 border px-4 py-2 rounded-lg text-sm font-medium"
                                    >
                                        {search.is_active
                                            ? "Pause Alerts"
                                            : "Enable Alerts"}
                                    </button>


                                    <button
                                        onClick={() =>
                                            deleteSearch(
                                                search.id
                                            )
                                        }
                                        className="px-4 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-medium"
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        )
                    )}

                </div>

            )}

        </div>
    );
}