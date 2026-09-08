import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import ImageUploader from "../../components/properties/ImageUploader";
import PropertyLocationPicker from "../../components/smart-map/PropertyLocationPicker";
import propertyService from "../../services/propertyService";


function AddProperty() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

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
        latitude: "",
        longitude: "",
    });
    
    const [images, setImages] = useState([]);
    const [location, setLocation] = useState({
        latitude: formData.latitude || "",
        longitude: formData.longitude || "",
    });


    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

    };


    const handleLocationChange = (nextLocation) => {
        setLocation(nextLocation);

        setFormData((prevData) => ({
            ...prevData,
            latitude: nextLocation.latitude,
            longitude: nextLocation.longitude,
        }));
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!formData.title.trim()) {
            toast.error("Please enter a property title.");
            return;
        }

        if (!formData.property_type) {
            toast.error("Please select a property type.");
            return;
        }

        if (!formData.price) {
            toast.error("Please enter the property price.");
            return;
        }

        if (!formData.county.trim()) {
            toast.error("Please enter the county.");
            return;
        }

        if (!formData.estate.trim()) {
            toast.error("Please enter the estate.");
            return;
        }

        try {

            setLoading(true);

            const payload = {
                ...formData,
                latitude: location.latitude,
                longitude: location.longitude,
            };

            /*
             * Step 1:
             * Create property.
             */
            const property =
                await propertyService.createProperty(payload);


            /*
             * Step 2:
             * Upload selected images.
             */
            if (images.length > 0) {

                await propertyService.uploadImages(
                    property.id,
                    images
                );

            }


            toast.success(
                "Property created successfully!"
            );


            /*
             * Step 3:
             * Go to My Properties.
             */
            navigate("/dashboard/my-properties");

        } catch (error) {

            console.log(
                "PROPERTY CREATE ERROR:",
                error.response?.data
            );

            toast.error(
                JSON.stringify(error.response?.data) ||
                "Failed to create property"
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="container py-5">

            <div className="card shadow-sm border-0">

                <div className="card-body p-4 p-md-5">

                    <div className="mb-4">

                        <h2 className="fw-bold mb-1">
                            Add New Property
                        </h2>

                        <p className="text-muted mb-0">
                            List your property on HomeLink Kenya.
                        </p>

                    </div>


                    <form onSubmit={handleSubmit}>

                        <div className="row">


                            {/* Title */}

                            <div className="col-md-8 mb-3">

                                <label className="form-label fw-semibold">
                                    Property Title
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="title"
                                    placeholder="e.g. Modern 2 Bedroom Apartment"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            {/* Property Type */}

                            <div className="col-md-4 mb-3">

                                <label className="form-label fw-semibold">
                                    Property Type
                                </label>

                                <select
                                    className="form-select"
                                    name="property_type"
                                    value={formData.property_type}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">
                                        Select Property Type
                                    </option>

                                    <optgroup label="Residential">
                                        <option value="SINGLE_ROOM">Single Room</option>
                                        <option value="BEDSITTER">Bedsitter</option>
                                        <option value="STUDIO">Studio Apartment</option>
                                        <option value="ONE_BEDROOM">One Bedroom</option>
                                        <option value="TWO_BEDROOM">Two Bedroom</option>
                                        <option value="THREE_BEDROOM">Three Bedroom</option>
                                        <option value="FOUR_BEDROOM">Four Bedroom</option>
                                        <option value="APARTMENT">Apartment</option>
                                        <option value="MAISONETTE">Maisonette</option>
                                        <option value="BUNGALOW">Bungalow</option>
                                        <option value="VILLA">Villa</option>
                                    </optgroup>

                                    <optgroup label="Commercial">
                                        <option value="SHOP">Shop</option>
                                        <option value="OFFICE">Office</option>
                                        <option value="WAREHOUSE">Warehouse</option>
                                        <option value="GODOWN">Godown</option>
                                        <option value="HOTEL">Hotel</option>
                                        <option value="RESTAURANT">Restaurant</option>
                                    </optgroup>

                                    <optgroup label="Land">
                                        <option value="LAND">Land</option>
                                        <option value="RESIDENTIAL_PLOT">Residential Plot</option>
                                        <option value="COMMERCIAL_PLOT">Commercial Plot</option>
                                        <option value="AGRICULTURAL_LAND">Agricultural Land</option>
                                    </optgroup>

                                    <optgroup label="Institutional">
                                        <option value="SCHOOL">School</option>
                                        <option value="COLLEGE">College</option>
                                        <option value="UNIVERSITY">University</option>
                                        <option value="HOSPITAL">Hospital</option>
                                        <option value="CHURCH">Church</option>
                                    </optgroup>

                                </select>

                            </div>


                            {/* Purpose */}

                            <div className="col-md-4 mb-3">

                                <label className="form-label fw-semibold">
                                    Purpose
                                </label>

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


                            {/* Category */}

                            <div className="col-md-4 mb-3">

                                <label className="form-label fw-semibold">
                                    Category
                                </label>

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
                                    <option value="INSTITUTIONAL">Institutional</option>
                                </select>

                            </div>


                            {/* Price */}

                            <div className="col-md-4 mb-3">

                                <label className="form-label fw-semibold">
                                    Price (KSh)
                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    name="price"
                                    placeholder="e.g. 25000"
                                    min="0"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            {/* County */}

                            <div className="col-md-4 mb-3">

                                <label className="form-label fw-semibold">
                                    County
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="county"
                                    placeholder="e.g. Uasin Gishu"
                                    value={formData.county}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            {/* Estate */}

                            <div className="col-md-4 mb-3">

                                <label className="form-label fw-semibold">
                                    Estate / Area
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="estate"
                                    placeholder="e.g. Elgon View"
                                    value={formData.estate}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            {/* Bedrooms */}

                            <div className="col-md-6 mb-3">

                                <label className="form-label fw-semibold">
                                    Bedrooms
                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    name="bedrooms"
                                    min="0"
                                    value={formData.bedrooms}
                                    onChange={handleChange}
                                />

                            </div>


                            {/* Bathrooms */}

                            <div className="col-md-6 mb-3">

                                <label className="form-label fw-semibold">
                                    Bathrooms
                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    name="bathrooms"
                                    min="0"
                                    value={formData.bathrooms}
                                    onChange={handleChange}
                                />

                            </div>


                            {/* Furnishing */}

                            <div className="col-md-6 mb-3">

                                <label className="form-label fw-semibold">
                                    Furnishing
                                </label>

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


                            {/* Description */}

                            <div className="col-12 mb-4">

                                <label className="form-label fw-semibold">
                                    Description
                                </label>

                                <textarea
                                    className="form-control"
                                    rows="5"
                                    name="description"
                                    placeholder="Describe the property, amenities, location, etc."
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            {/* Location Picker */}

                            <div className="col-12 mb-4">
                                <PropertyLocationPicker
                                    latitude={location.latitude}
                                    longitude={location.longitude}
                                    onLocationChange={handleLocationChange}
                                />
                            </div>


                            {/* Images */}

                            <div className="col-12 mb-4">

                                <label className="form-label fw-semibold">
                                    Property Images
                                </label>

                                <ImageUploader
                                    onImagesChange={setImages}
                                />

                                <small className="text-muted">
                                    You can upload up to 20 images.
                                    The first image will automatically
                                    become the cover image.
                                </small>

                            </div>


                            {/* Buttons */}

                            <div className="col-12 d-flex gap-3">

                                <button
                                    type="button"
                                    className="btn btn-light border"
                                    onClick={() =>
                                        navigate(
                                            "/dashboard/my-properties"
                                        )
                                    }
                                    disabled={loading}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="btn btn-primary px-4"
                                    disabled={loading}
                                >

                                    {loading ? (
                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm me-2"
                                                role="status"
                                            ></span>

                                            Creating Property...
                                        </>
                                    ) : (
                                        "Create Property"
                                    )}

                                </button>

                            </div>

                        </div>

                    </form>

                </div>

            </div>

        </div>

    );

}

export default AddProperty;