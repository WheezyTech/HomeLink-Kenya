import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import propertyService from "../../services/propertyService";

function EditProperty() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        purpose: "",
        category: "",
        property_type: "",
        furnishing: "",
        availability: "AVAILABLE",
        price: "",
        county: "",
        estate: "",
        bedrooms: "",
        bathrooms: "",
    });

    useEffect(() => {
        const loadProperty = async () => {
            try {
                setLoading(true);
                const property = await propertyService.getProperty(id);

                setFormData({
                    title: property.title || "",
                    description: property.description || "",
                    purpose: property.purpose || "",
                    category: property.category || "",
                    property_type: property.property_type || "",
                    furnishing: property.furnishing || "",
                    availability: property.availability || "AVAILABLE",
                    price: property.price || "",
                    county: property.county || "",
                    estate: property.estate || "",
                    bedrooms: property.bedrooms || "",
                    bathrooms: property.bathrooms || "",
                });
            } catch (error) {
                console.error(error);
                toast.error("Unable to load this property right now.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadProperty();
        }
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            await propertyService.updateProperty(id, formData);
            toast.success("Property updated successfully.");
            navigate("/dashboard/my-properties");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update the property.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <p className="text-muted">Loading property details...</p>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="card shadow-sm border-0">
                <div className="card-body p-4 p-md-5">
                    <div className="mb-4">
                        <h2 className="fw-bold mb-1">Edit Property</h2>
                        <p className="text-muted mb-0">Update the property details below.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-8 mb-3">
                                <label className="form-label fw-semibold">Property Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label fw-semibold">Purpose</label>
                                <select
                                    className="form-select"
                                    name="purpose"
                                    value={formData.purpose}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Purpose</option>
                                    <option value="RENT">For Rent</option>
                                    <option value="SALE">For Sale</option>
                                </select>
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label fw-semibold">Category</label>
                                <select
                                    className="form-select"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Category</option>
                                    <option value="RESIDENTIAL">Residential</option>
                                    <option value="COMMERCIAL">Commercial</option>
                                    <option value="LAND">Land</option>
                                </select>
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label fw-semibold">Property Type</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="property_type"
                                    value={formData.property_type}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label fw-semibold">Price (KSh)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    min="0"
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label fw-semibold">County</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="county"
                                    value={formData.county}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label fw-semibold">Estate / Area</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="estate"
                                    value={formData.estate}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label fw-semibold">Bedrooms</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="bedrooms"
                                    value={formData.bedrooms}
                                    onChange={handleChange}
                                    min="0"
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label fw-semibold">Bathrooms</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="bathrooms"
                                    value={formData.bathrooms}
                                    onChange={handleChange}
                                    min="0"
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label fw-semibold">Furnishing</label>
                                <select
                                    className="form-select"
                                    name="furnishing"
                                    value={formData.furnishing}
                                    onChange={handleChange}
                                >
                                    <option value="">Select</option>
                                    <option value="FURNISHED">Furnished</option>
                                    <option value="SEMI_FURNISHED">Semi Furnished</option>
                                    <option value="UNFURNISHED">Unfurnished</option>
                                </select>
                            </div>

                            <div className="col-12 mb-3">
                                <label className="form-label fw-semibold">Description</label>
                                <textarea
                                    className="form-control"
                                    rows="5"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-12 d-flex gap-3">
                                <button type="button" className="btn btn-light border" onClick={() => navigate("/dashboard/my-properties")}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditProperty;
