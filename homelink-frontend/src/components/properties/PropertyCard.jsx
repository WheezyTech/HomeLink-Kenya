import { Link } from "react-router-dom";
import { FaBed, FaBath, FaMapMarkerAlt, FaEye } from "react-icons/fa";
import FavouriteButton from "./FavouriteButton";

function PropertyCard({ property }) {
    const isNew =
        property.created_at &&
        Date.now() - new Date(property.created_at).getTime() < 7 * 24 * 60 * 60 * 1000;

    return (
        <div className="card property-card shadow-sm border-0 h-100">
            <div className="position-relative">
                <Link to={`/properties/${property.id}`}>
                    <img
                        src={
                            property.cover_image ||
                            "https://via.placeholder.com/600x400"
                        }
                        className="card-img-top property-image"
                        alt={property.title}
                    />
                </Link>

                <div className="position-absolute top-0 start-0 m-2 d-flex flex-wrap gap-2">
                    {property.purpose === "RENT" && (
                        <span className="badge bg-success">For Rent</span>
                    )}

                    {property.purpose === "SALE" && (
                        <span className="badge bg-primary">For Sale</span>
                    )}

                    {property.is_verified && (
                        <span className="badge bg-info text-dark">Verified</span>
                    )}

                    {property.is_featured && (
                        <span className="badge bg-warning text-dark">Featured</span>
                    )}

                    {isNew && (
                        <span className="badge bg-danger">🔥 NEW</span>
                    )}
                </div>
            </div>

            <div className="card-body">
                <Link
                    to={`/properties/${property.id}`}
                    className="text-decoration-none text-dark"
                >
                    <h5 className="fw-bold mb-0">
                        {property.title}
                    </h5>
                </Link>

                <p className="text-muted mt-2 mb-3">
                    <FaMapMarkerAlt /> {property.estate}, {property.county}
                </p>

                {property.trust_score && (
                    <div className="small mb-3">
                        <span className="fw-semibold text-success">
                            {property.trust_score.score}% trusted
                        </span>
                        <span className="text-muted ms-2">
                            {property.trust_score.label}
                        </span>
                        {property.trust_score.pending_reports > 0 && (
                            <div className="text-warning mt-1">
                                Reports under review
                            </div>
                        )}
                    </div>
                )}

                <p className="small text-uppercase text-secondary fw-bold mb-2">
                    {property.property_type}
                </p>

                <div className="d-flex justify-content-between mb-3">
                    <span>
                        <FaBed /> {property.bedrooms} Beds
                    </span>
                    <span>
                        <FaBath /> {property.bathrooms} Baths
                    </span>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h4 className="text-primary mb-0">
                        KSh {Number(property.price).toLocaleString()}
                        {property.purpose === "RENT" && (
                            <small className="text-muted"> / month</small>
                        )}
                    </h4>
                </div>

                <div className="text-muted small d-flex align-items-center gap-2">
                    <FaEye /> {property.views || 0} Views
                </div>
            </div>

            <div className="card-footer bg-white border-0 d-flex justify-content-between align-items-center">
                <FavouriteButton propertyId={property.id} />

                <Link
                    to={`/properties/${property.id}`}
                    className="btn btn-outline-primary btn-sm"
                >
                    View Details <span className="ms-1">→</span>
                </Link>
            </div>
        </div>
    );
}

export default PropertyCard;