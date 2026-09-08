import { useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000/api";

export default function SaveSearchButton({
    filters,
}) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const token =
        localStorage.getItem("access_token");

    async function saveSearch() {
        if (!name.trim()) {
            setMessage("Enter a name for this search.");
            return;
        }

        try {
            setSaving(true);
            setMessage("");

            await axios.post(
                `${API}/alerts/saved-searches/`,
                {
                    name: name.trim(),

                    location:
                        filters.location || "",

                    property_type:
                        filters.property_type || "",

                    min_price:
                        filters.min_price || null,

                    max_price:
                        filters.max_price || null,

                    bedrooms:
                        filters.bedrooms || null,

                    bathrooms:
                        filters.bathrooms || null,

                    is_active: true,

                    notify_email: true,

                    notify_push: true,
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            setMessage(
                "Search saved successfully."
            );

            setName("");

            setTimeout(() => {
                setOpen(false);
                setMessage("");
            }, 1500);

        } catch (error) {
            console.error(error);

            setMessage(
                error.response?.data?.detail ||
                "Unable to save search."
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="relative">

            <button
                type="button"
                onClick={() =>
                    setOpen(!open)
                }
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
                🔔 Save This Search
            </button>


            {open && (

                <div className="absolute right-0 top-12 z-50 w-80 bg-white border rounded-xl shadow-xl p-5">

                    <h3 className="font-bold text-lg">
                        Save Search
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                        We'll notify you when a new
                        property matches these filters.
                    </p>


                    <input
                        type="text"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        placeholder="e.g. Eldoret 2 Bedroom"
                        className="w-full border rounded-lg px-3 py-2 mt-4"
                    />


                    {message && (

                        <p className="text-sm mt-3 text-blue-600">
                            {message}
                        </p>

                    )}


                    <div className="flex gap-2 mt-4">

                        <button
                            type="button"
                            onClick={() =>
                                setOpen(false)
                            }
                            className="flex-1 border rounded-lg py-2"
                        >
                            Cancel
                        </button>


                        <button
                            type="button"
                            disabled={saving}
                            onClick={saveSearch}
                            className="flex-1 bg-blue-600 text-white rounded-lg py-2 disabled:opacity-50"
                        >
                            {saving
                                ? "Saving..."
                                : "Save Search"}
                        </button>

                    </div>

                </div>

            )}

        </div>
    );
}