import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaEye,
    FaHeart,
    FaStar,
} from "react-icons/fa";

import DashboardLayout from "../../layouts/DashboardLayout";
import propertyService from "../../services/propertyService";

function MyProperties() {

    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadProperties();
    }, []);

    const loadProperties = async () => {

        try {

            setLoading(true);

            const data = await propertyService.getMyProperties();

            setProperties(data);

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to load your properties."
            );

        } finally {

            setLoading(false);

        }
    };

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this property?"
        );

        if (!confirmed) return;

        try {

            await propertyService.deleteProperty(id);

            setProperties((prev) =>
                prev.filter((property) => property.id !== id)
            );

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "Failed to delete property."
            );

        }
    };

    return (

        <DashboardLayout>

            <div className="container-fluid p-4">

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <div>

                        <h2 className="fw-bold mb-1">
                            My Properties
                        </h2>

                        <p className="text-muted mb-0">
                            Manage properties you have listed on HomeLink.
                        </p>

                    </div>

                    <Link
                        to="/properties/add"
                        className="btn btn-primary"
                    >
                        <FaPlus className="me-2" />
                        Add Property
                    </Link>

                </div>

                {loading && (
                    <div className="text-center py-5">
                        <div
                            className="spinner-border text-primary"
                            role="status"
                        />

                        <p className="mt-3 text-muted">
                            Loading your properties...
                        </p>
                    </div>
                )}

                {!loading && error && (

                    <div className="alert alert-danger">
                        {error}
                    </div>

                )}

                {!loading && !error && properties.length === 0 && (

                    <div className="card border-0 shadow-sm">

                        <div className="card-body text-center py-5">

                            <h4>
                                You haven't listed any properties yet.
                            </h4>

                            <p className="text-muted">
                                Start by adding your first property.
                            </p>

                            <Link
                                to="/properties/add"
                                className="btn btn-primary"
                            >
                                <FaPlus className="me-2" />
                                Add Property
                            </Link>

                        </div>

                    </div>

                )}

                {!loading && !error && properties.length > 0 && (

                    <div className="row g-4">

                        {properties.map((property) => (

                            <div
                                className="col-xl-4 col-lg-6"
                                key={property.id}
                            >

                                <div className="card border-0 shadow-sm h-100">

                                    <div
                                        style={{
                                            height: "220px",
                                            overflow: "hidden",
                                            background: "#f1f5f9",
                                        }}
                                    >

                                        {property.cover_image ? (

                                            <img
                                                src={property.cover_image}
                                                alt={property.title}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                }}
                                            />

                                        ) : (

                                            <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                                                No image
                                            </div>

                                        )}

                                    </div>

                                    <div className="card-body">

                                        <div className="d-flex justify-content-between align-items-start mb-2">

                                            <Link
                                                to={`/properties/${property.id}`}
                                                className="text-decoration-none text-dark"
                                            >
                                                <h5 className="fw-bold mb-0">
                                                    {property.title}
                                                </h5>
                                            </Link>

                                            <span
                                                className={`badge ${
                                                    property.status === "APPROVED"
                                                        ? "bg-success"
                                                        : property.status === "REJECTED"
                                                        ? "bg-danger"
                                                        : property.status === "RENTED"
                                                        ? "bg-secondary"
                                                        : "bg-warning text-dark"
                                                }`}
                                            >
                                                {property.status}
                                            </span>

                                        </div>

                                        <p className="text-muted mb-2">

                                            {property.estate},{" "}
                                            {property.county}

                                        </p>

                                        <h5 className="text-primary fw-bold">

                                            KSh{" "}
                                            {Number(
                                                property.price || 0
                                            ).toLocaleString()}

                                        </h5>

                                        <div className="d-flex gap-3 text-muted small mt-3">

                                            <span>
                                                <FaEye className="me-1" />
                                                {property.views || 0}
                                            </span>

                                            <span>
                                                <FaHeart className="me-1" />
                                                {property.favourites || 0}
                                            </span>

                                            {property.is_featured && (
                                                <span className="text-warning">
                                                    <FaStar className="me-1" />
                                                    Featured
                                                </span>
                                            )}

                                        </div>

                                    </div>

                                    <div className="card-footer bg-white border-0 d-flex gap-2">

                                        <Link
                                            to={`/properties/${property.id}`}
                                            className="btn btn-primary btn-sm"
                                        >
                                            View Property
                                        </Link>

                                        <Link
                                            to={`/properties/${property.id}/edit`}
                                            className="btn btn-outline-primary btn-sm"
                                        >
                                            <FaEdit className="me-1" />
                                            Edit
                                        </Link>

                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() =>
                                                handleDelete(property.id)
                                            }
                                        >
                                            <FaTrash />
                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </DashboardLayout>

    );
}

export default MyProperties;