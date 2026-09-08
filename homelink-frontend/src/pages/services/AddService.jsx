import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://127.0.0.1:8000/api";

export default function AddService() {

    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);

    const [form, setForm] = useState({
        category: "",
        title: "",
        description: "",
        pricing_type: "STARTING_FROM",
        price: "",
        duration_hours: "",
        service_area: "",
    });

    const token = localStorage.getItem("access_token");

    useEffect(() => {
        loadCategories();
    }, []);

    async function loadCategories() {

        const response = await axios.get(
            `${API}/services/categories/`
        );

        setCategories(response.data.results || response.data);
    }

    function handleChange(e) {

        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e) {

        e.preventDefault();

        try {

            await axios.post(
                `${API}/services/listings/`,
                form,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Service created successfully.");

            navigate("/services/provider/dashboard");

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.detail ||
                "Unable to create service."
            );
        }
    }

    return (

        <div className="max-w-3xl mx-auto py-10">

            <h1 className="text-3xl font-bold mb-8">
                Add New Service
            </h1>

            <form
                onSubmit={handleSubmit}
                className="space-y-5 bg-white shadow rounded-xl p-8"
            >

                <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                    required
                >

                    <option value="">
                        Select Category
                    </option>

                    {categories.map(category => (

                        <option
                            key={category.id}
                            value={category.id}
                        >
                            {category.name}
                        </option>

                    ))}

                </select>

                <input
                    type="text"
                    name="title"
                    placeholder="Service Title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                    required
                />

                <textarea
                    rows="5"
                    name="description"
                    placeholder="Describe your service..."
                    value={form.description}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                    required
                />

                <select
                    name="pricing_type"
                    value={form.pricing_type}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                >

                    <option value="FIXED">
                        Fixed Price
                    </option>

                    <option value="STARTING_FROM">
                        Starting From
                    </option>

                    <option value="HOURLY">
                        Hourly
                    </option>

                    <option value="QUOTE">
                        Request Quote
                    </option>

                </select>

                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                />

                <input
                    type="number"
                    name="duration_hours"
                    placeholder="Estimated Hours"
                    value={form.duration_hours}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                />

                <input
                    type="text"
                    name="service_area"
                    placeholder="Service Area"
                    value={form.service_area}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                />

                <button
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg w-full"
                >
                    Create Service
                </button>

            </form>

        </div>

    );

}