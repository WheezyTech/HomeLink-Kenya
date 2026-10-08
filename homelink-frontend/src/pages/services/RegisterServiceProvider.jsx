import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getServiceCategories } from "../../services/servicesApi";

const API = "http://127.0.0.1:8000/api";

export default function RegisterServiceProvider() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [categories, setCategories] = useState([]);

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        username: "",
        account_email: "",
        account_phone: "",
        password: "",
        confirm_password: "",
        provider_type: "INDIVIDUAL",
        primary_category: "",
        business_name: "",
        description: "",
        qualification: "",
        license_number: "",
        phone: "",
        email: "",
        county: "",
        town: "",
        estate: "",
        years_experience: 0,
        starting_price: "",
    });

    const token = localStorage.getItem("access") || localStorage.getItem("access_token");

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await getServiceCategories();
                setCategories(data || []);
            } catch (categoryError) {
                console.error("Failed to load service categories:", categoryError);
                setError("Unable to load service categories. Please refresh and try again.");
            }
        };

        loadCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const headers = {
                "Content-Type": "application/json",
            };

            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const response = await axios.post(
                `${API}/services/providers/register/`,
                {
                    ...form,
                    years_experience: Number(form.years_experience || 0),
                    starting_price: form.starting_price ? Number(form.starting_price) : null,
                },
                {
                    headers,
                }
            );

            alert(response.data?.message || "Provider registration submitted successfully.");
            navigate(token ? "/services/provider/dashboard" : "/login");
        } catch (err) {
            const data = err.response?.data;

            if (typeof data === "object" && data !== null) {
                const flattenMessages = (value) => {
                    if (Array.isArray(value)) {
                        return value.flatMap(flattenMessages);
                    }

                    if (value && typeof value === "object") {
                        return Object.values(value).flatMap(flattenMessages);
                    }

                    return value ? [String(value)] : [];
                };

                const messages = flattenMessages(data).join(" ");

                setError(messages || "Unable to register as a service provider.");
                return;
            }

            setError("Unable to register as a service provider.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 bg-light py-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card shadow-sm border-0">
                            <div className="card-body p-4 p-md-5">
                                <h1 className="h3 fw-bold mb-3">Become a Service Provider</h1>
                                <p className="text-muted mb-4">
                                    Create your HomeLink account and provider profile in one step.
                                </p>

                                {error && (
                                    <div className="alert alert-danger">{error}</div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="row g-3">
                                        {!token && (
                                            <>
                                                <div className="col-12">
                                                    <h2 className="h5 mb-0">Your account</h2>
                                                    <p className="text-muted small mb-0">
                                                        You will verify your email and phone before signing in.
                                                    </p>
                                                </div>

                                                <div className="col-md-6">
                                                    <label className="form-label">First Name</label>
                                                    <input
                                                        type="text"
                                                        name="first_name"
                                                        className="form-control"
                                                        value={form.first_name}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>

                                                <div className="col-md-6">
                                                    <label className="form-label">Last Name</label>
                                                    <input
                                                        type="text"
                                                        name="last_name"
                                                        className="form-control"
                                                        value={form.last_name}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>

                                                <div className="col-md-6">
                                                    <label className="form-label">Username</label>
                                                    <input
                                                        type="text"
                                                        name="username"
                                                        className="form-control"
                                                        value={form.username}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>

                                                <div className="col-md-6">
                                                    <label className="form-label">Account Email</label>
                                                    <input
                                                        type="email"
                                                        name="account_email"
                                                        className="form-control"
                                                        value={form.account_email}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>

                                                <div className="col-md-6">
                                                    <label className="form-label">Account Phone</label>
                                                    <input
                                                        type="tel"
                                                        name="account_phone"
                                                        className="form-control"
                                                        value={form.account_phone}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>

                                                <div className="col-md-6">
                                                    <label className="form-label">Password</label>
                                                    <input
                                                        type="password"
                                                        name="password"
                                                        className="form-control"
                                                        value={form.password}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>

                                                <div className="col-md-6">
                                                    <label className="form-label">Confirm Password</label>
                                                    <input
                                                        type="password"
                                                        name="confirm_password"
                                                        className="form-control"
                                                        value={form.confirm_password}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>

                                                <div className="col-12">
                                                    <hr />
                                                    <h2 className="h5 mb-0">Provider profile</h2>
                                                </div>
                                            </>
                                        )}

                                        <div className="col-md-6">
                                            <label className="form-label">Provider Type</label>
                                            <select
                                                name="provider_type"
                                                className="form-select"
                                                value={form.provider_type}
                                                onChange={handleChange}
                                            >
                                                <option value="INDIVIDUAL">Individual</option>
                                                <option value="COMPANY">Company</option>
                                            </select>
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Service You Provide</label>
                                            <select
                                                name="primary_category"
                                                className="form-select"
                                                value={form.primary_category}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select a service</option>
                                                {categories.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Business Name</label>
                                            <input
                                                type="text"
                                                name="business_name"
                                                className="form-control"
                                                value={form.business_name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="col-12">
                                            <label className="form-label">Description</label>
                                            <textarea
                                                name="description"
                                                rows="4"
                                                className="form-control"
                                                value={form.description}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="col-12">
                                            <hr />
                                            <h2 className="h5 mb-1">Qualifications and licensing</h2>
                                            <p className="text-muted small">
                                                Optional. Add details that help customers and HomeLink verify your expertise.
                                            </p>
                                        </div>

                                        <div className="col-12">
                                            <label className="form-label">Qualifications or certifications</label>
                                            <textarea
                                                name="qualification"
                                                rows="3"
                                                className="form-control"
                                                value={form.qualification}
                                                onChange={handleChange}
                                                placeholder="For example: Certificate in Plumbing, NITA training, or 10 years of trade experience"
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">License number <span className="text-muted">(optional)</span></label>
                                            <input
                                                type="text"
                                                name="license_number"
                                                className="form-control"
                                                value={form.license_number}
                                                onChange={handleChange}
                                                placeholder="Professional or business license number"
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Phone</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                className="form-control"
                                                value={form.phone}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                className="form-control"
                                                value={form.email}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="col-md-4">
                                            <label className="form-label">County</label>
                                            <input
                                                type="text"
                                                name="county"
                                                className="form-control"
                                                value={form.county}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="col-md-4">
                                            <label className="form-label">Town</label>
                                            <input
                                                type="text"
                                                name="town"
                                                className="form-control"
                                                value={form.town}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="col-md-4">
                                            <label className="form-label">Estate</label>
                                            <input
                                                type="text"
                                                name="estate"
                                                className="form-control"
                                                value={form.estate}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Years of Experience</label>
                                            <input
                                                type="number"
                                                name="years_experience"
                                                className="form-control"
                                                min="0"
                                                value={form.years_experience}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Starting Price (KSh)</label>
                                            <input
                                                type="number"
                                                name="starting_price"
                                                className="form-control"
                                                min="0"
                                                value={form.starting_price}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="d-flex gap-3 mt-4">
                                        <button
                                            type="submit"
                                            className="btn btn-primary px-4"
                                            disabled={loading}
                                        >
                                            {loading ? "Submitting..." : "Register as Provider"}
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => navigate("/services/provider/dashboard")}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
