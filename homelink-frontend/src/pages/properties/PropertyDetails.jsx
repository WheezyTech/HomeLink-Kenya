import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    FaArrowLeft,
    FaBath,
    FaBed,
    FaCalendarAlt,
    FaHeart,
    FaMapMarkerAlt,
    FaPhone,
    FaRegHeart,
    FaShareAlt,
    FaUser,
} from "react-icons/fa";

import propertyService from "../../services/propertyService";
import reportService from "../../services/reportService";
import favouriteService from "../../services/favouriteService";
import ImageGallery from "../../components/properties/ImageGallery";
import PropertyCard from "../../components/properties/PropertyCard";
import TrueCostEstimate from "../../components/properties/TrueCostEstimate";
import SmartPropertyMap from "../../components/property-map/SmartPropertyMap";
import LocationIntelligence from "../../components/property-map/LocationIntelligence";
import DirectionsPanel from "../../components/property-map/DirectionsPanel";
import "../../styles/property-details.css";
import RequestViewing from "../../components/bookings/RequestViewing";
import { useAuth } from "../../context/AuthContext";

function PropertyDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [property, setProperty] = useState(null);
    const [similarProperties, setSimilarProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [favourite, setFavourite] = useState(false);
    const [favouriteLoading, setFavouriteLoading] = useState(false);
    const [error, setError] = useState("");
    const [showReportForm, setShowReportForm] = useState(false);
    const [reportReason, setReportReason] = useState("FRAUD");
    const [reportDescription, setReportDescription] = useState("");
    const [reportSubmitting, setReportSubmitting] = useState(false);
    const [reportSubmitted, setReportSubmitted] = useState(false);

    const { user } = useAuth();

    const handleReportSubmit = async (event) => {
        event.preventDefault();

        if (!user) {
            navigate("/login");
            return;
        }

        try {
            setReportSubmitting(true);
            await reportService.createReport({
                property: property.id,
                reason: reportReason,
                description: reportDescription,
            });
            setReportSubmitted(true);
            setShowReportForm(false);
            setReportDescription("");
        } catch (reportError) {
            const message = reportError.response?.data?.detail ||
                reportError.response?.data?.message ||
                "Unable to submit this report.";
            window.alert(message);
        } finally {
            setReportSubmitting(false);
        }
    };

    useEffect(() => {
        loadProperty();
        checkFavourite();
    }, [id]);

    const loadProperty = async () => {

        try {

            setLoading(true);

            const data = await propertyService.getProperty(id);

            setProperty(data);
            await loadSimilarProperties(data);

        } catch (error) {

            console.error(
                "Failed to load property:",
                error.response?.data || error.message
            );

            setError("Unable to load property.");

        } finally {

            setLoading(false);

        }
    };

    const loadSimilarProperties = async (currentProperty) => {
        try {
            if (!currentProperty) {
                return;
            }

            const filters = {};

            if (currentProperty.county) {
                filters.county = currentProperty.county;
            }

            if (currentProperty.property_type) {
                filters.property_type = currentProperty.property_type;
            }

            if (currentProperty.purpose) {
                filters.purpose = currentProperty.purpose;
            }

            if (Object.keys(filters).length === 0) {
                setSimilarProperties([]);
                return;
            }

            const data = await propertyService.getFilteredProperties(filters);
            const results = (data.results || data).filter(
                (item) => String(item.id) !== String(currentProperty.id)
            );

            setSimilarProperties(results.slice(0, 3));
        } catch (error) {
            console.error("Unable to load similar properties:", error);
        }
    };

    const checkFavourite = async () => {

        try {

            const favourites =
                await favouriteService.getFavourites();

            const exists = favourites.some(
                (item) =>
                    String(item.property) === String(id)
            );

            setFavourite(exists);

        } catch (error) {

            console.error(
                "Unable to check favourite:",
                error.response?.data || error.message
            );

        }
    };

    const handleFavourite = async () => {

        if (favouriteLoading) {
            return;
        }

        try {

            setFavouriteLoading(true);

            const response =
                await favouriteService.toggleFavourite(id);

            setFavourite(
                response.action === "added"
            );

        } catch (error) {

            console.error(
                "Favourite error:",
                error.response?.data || error.message
            );

        } finally {

            setFavouriteLoading(false);

        }
    };

    const handleShare = async () => {

        try {

            await navigator.clipboard.writeText(
                window.location.href
            );

            alert("Property link copied.");

        } catch {

            alert("Unable to copy property link.");

        }
    };

    if (loading) {

        return (
            <div className="container py-5 text-center">

                <div
                    className="spinner-border text-primary"
                    role="status"
                />

                <p className="mt-3">
                    Loading property...
                </p>

            </div>
        );

    }

    if (error || !property) {

        return (
            <div className="container py-5 text-center">

                <h3>
                    {error || "Property not found."}
                </h3>

                <Link
                    to="/properties"
                    className="btn btn-primary mt-3"
                >
                    Browse Properties
                </Link>

            </div>
        );

    }

    const images = property.images || [];
    const purposeLabel = property.purpose === "RENT" ? "For Rent" : "For Sale";
    const furnishingLabel = property.furnishing
        ? property.furnishing.replace(/_/g, " ").toLowerCase().replace(/^./, (char) => char.toUpperCase())
        : null;

    return (

        <div className="property-details-page">

            <div className="container py-4">

                <button
                    className="btn btn-light mb-3"
                    onClick={() => navigate(-1)}
                >
                    <FaArrowLeft />
                    &nbsp; Back
                </button>

                <div className="property-gallery">
                    <ImageGallery images={images} />
                </div>

                <div className="row g-4 mt-2">

                    <div className="col-lg-8">

                        <div className="card border-0 shadow-sm">

                            <div className="card-body p-4">

                                <div className="d-flex justify-content-between align-items-start gap-3">

                                    <div>

                                        <div className="d-flex flex-wrap gap-2 mb-2">
                                            <span className="badge bg-success">
                                                {purposeLabel}
                                            </span>
                                            <span className="badge bg-primary">
                                                {property.property_type}
                                            </span>
                                            {property.category && (
                                                <span className="badge bg-secondary">
                                                    {property.category}
                                                </span>
                                            )}
                                            {furnishingLabel && (
                                                <span className="badge bg-light text-dark">
                                                    {furnishingLabel}
                                                </span>
                                            )}
                                        </div>

                                        <h1 className="property-details-title d-flex align-items-center flex-wrap gap-2">
                                            {property.title}
                                            {property.is_verified && (
                                                <span className="badge bg-success ms-2">
                                                    ✔ Verified
                                                </span>
                                            )}
                                            {property.is_featured && (
                                                <span className="badge bg-warning text-dark">
                                                    Featured
                                                </span>
                                            )}
                                        </h1>

                                        <p className="text-muted">

                                            <FaMapMarkerAlt />

                                            &nbsp;

                                            {property.estate}, {property.county}

                                        </p>

                                        {property.trust_score && (
                                            <div className="alert alert-light border d-inline-flex align-items-center gap-2 py-2 px-3 mb-0">
                                                <strong className="text-success">
                                                    {property.trust_score.score}% trusted
                                                </strong>
                                                <span className="text-muted">
                                                    {property.trust_score.label}
                                                </span>
                                                {property.trust_score.pending_reports > 0 && (
                                                    <span className="text-warning small">
                                                        Reports under review
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                    </div>


                                    <div className="d-flex gap-2">

                                        <button
                                            className="btn btn-light"
                                            onClick={handleFavourite}
                                            disabled={favouriteLoading}
                                            title={
                                                favourite
                                                    ? "Remove from favourites"
                                                    : "Add to favourites"
                                            }
                                        >
                                            {favourite ? (
                                                <FaHeart className="text-danger" />
                                            ) : (
                                                <FaRegHeart />
                                            )}
                                        </button>

                                        <button
                                            className="btn btn-light"
                                            onClick={handleShare}
                                            title="Share"
                                        >

                                            <FaShareAlt />

                                        </button>

                                    </div>

                                </div>


                                <h2 className="property-price mt-3">

                                    KSh {Number(property.price).toLocaleString()}

                                    {property.purpose === "RENT" && (
                                        <small className="text-muted"> / month</small>
                                    )}

                                </h2>

                                {property.purpose === "RENT" && (
                                    <TrueCostEstimate rent={property.price} />
                                )}


                                <div className="property-features">

                                    <div>
                                        <FaBed />
                                        <strong>
                                            {property.bedrooms}
                                        </strong>
                                        <span>Bedrooms</span>
                                    </div>

                                    <div>
                                        <FaBath />
                                        <strong>
                                            {property.bathrooms}
                                        </strong>
                                        <span>Bathrooms</span>
                                    </div>

                                    <div>
                                        <strong>
                                            {property.views || 0}
                                        </strong>
                                        <span>Views</span>
                                    </div>

                                    <div>
                                        <strong>
                                            {property.favourites || 0}
                                        </strong>
                                        <span>Favourites</span>
                                    </div>

                                    <div>
                                        <strong>
                                            {property.bookings || 0}
                                        </strong>
                                        <span>Viewings</span>
                                    </div>

                                    <div>
                                        <strong>
                                            {property.chats || 0}
                                        </strong>
                                        <span>Chats</span>
                                    </div>

                                </div>


                                <hr />


                                <h4>
                                    Description
                                </h4>

                                <p className="property-description">

                                    {property.description}

                                </p>


                                {property.google_maps_url && (

                                    <a
                                        href={property.google_maps_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn btn-outline-primary"
                                    >
                                        <FaMapMarkerAlt />
                                        &nbsp; View on Google Maps
                                    </a>

                                )}

                                {user && user.role === "TENANT" && (
                                    <RequestViewing propertyId={property.id} />
                                )}

                                {property.latitude && property.longitude && (
                                    <div className="mt-8">
                                        <LocationIntelligence
                                            latitude={property.latitude}
                                            longitude={property.longitude}
                                        />
                                    </div>
                                )}

                                {property.latitude &&
                                    property.longitude && (

                                        <DirectionsPanel
                                            latitude={property.latitude}
                                            longitude={property.longitude}
                                        />

                                    )}

                                <div className="mt-10">
                                    <SmartPropertyMap
                                        latitude={property.latitude}
                                        longitude={property.longitude}
                                        title={property.title}
                                    />
                                </div>

                            </div>

                        </div>

                    </div>

                    <div className="col-lg-4">

                        <div className="card border-0 shadow-sm contact-property-card">

                            <div className="card-body p-4">

                                <h4 className="mb-3">
                                    Listed by
                                </h4>

                                <div className="property-owner mb-3">

                                    <div className="owner-icon">

                                        <FaUser />

                                    </div>

                                    <div>

                                        <strong>
                                            {property.owner_name || "Property Owner"}
                                        </strong>

                                        {property.owner_phone && (
                                            <p className="text-muted mb-0 mt-1">
                                                <FaPhone /> {property.owner_phone}
                                            </p>
                                        )}

                                    </div>

                                </div>

                                <div className="mb-3">
                                    {property.is_verified ? (
                                        <div className="text-success fw-semibold">
                                            ✓ Verified Agent
                                        </div>
                                    ) : (
                                        <div className="text-muted">
                                            Verification pending
                                        </div>
                                    )}
                                    <div className="text-warning mt-2">
                                        ★★★★★
                                    </div>
                                </div>

                                <div className="d-grid gap-2">
                                    <a
                                        href={property.owner_phone ? `tel:${property.owner_phone}` : "#"}
                                        className="btn btn-primary"
                                    >
                                        Call
                                    </a>
                                    <a
                                        href={property.owner_phone ? `https://wa.me/${property.owner_phone}` : "#"}
                                        className="btn btn-outline-success"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        WhatsApp
                                    </a>
                                    <button
                                        className="btn btn-outline-primary"
                                        onClick={() =>
                                            navigate(
                                                `/dashboard/bookings?property=${property.id}`
                                            )
                                        }
                                    >
                                        Book Viewing
                                    </button>
                                    <button
                                        className="btn btn-outline-dark"
                                        onClick={() =>
                                            navigate(
                                                `/dashboard/chat?property=${property.id}`
                                            )
                                        }
                                    >
                                        Chat
                                    </button>
                                    {user && !reportSubmitted && (
                                        <button
                                            className="btn btn-link text-danger"
                                            onClick={() => setShowReportForm((current) => !current)}
                                        >
                                            Report this listing
                                        </button>
                                    )}
                                    {reportSubmitted && (
                                        <div className="small text-success text-center">
                                            Report submitted for review.
                                        </div>
                                    )}
                                </div>

                                {showReportForm && (
                                    <form className="border-top mt-3 pt-3" onSubmit={handleReportSubmit}>
                                        <label className="form-label fw-semibold" htmlFor="report-reason">
                                            Why are you reporting this listing?
                                        </label>
                                        <select
                                            id="report-reason"
                                            className="form-select mb-2"
                                            value={reportReason}
                                            onChange={(event) => setReportReason(event.target.value)}
                                        >
                                            <option value="FRAUD">Possible fraud or scam</option>
                                            <option value="FAKE_OWNER">Fake owner or agent</option>
                                            <option value="DUPLICATE">Duplicate listing</option>
                                            <option value="ALREADY_RENTED">Already rented or sold</option>
                                            <option value="WRONG_LOCATION">Wrong location</option>
                                            <option value="INAPPROPRIATE">Inappropriate content</option>
                                            <option value="OTHER">Other</option>
                                        </select>
                                        <textarea
                                            className="form-control mb-2"
                                            rows="3"
                                            placeholder="Tell us what looks suspicious (minimum 10 characters)."
                                            value={reportDescription}
                                            onChange={(event) => setReportDescription(event.target.value)}
                                            minLength={10}
                                            required
                                        />
                                        <button
                                            type="submit"
                                            className="btn btn-danger w-100"
                                            disabled={reportSubmitting}
                                        >
                                            {reportSubmitting ? "Submitting..." : "Submit report"}
                                        </button>
                                    </form>
                                )}

                            </div>

                        </div>

                    </div>

                </div>

                {similarProperties.length > 0 && (
                    <div className="mt-5">
                        <h3 className="mb-4">Similar Properties</h3>
                        <div className="row g-4">
                            {similarProperties.map((item) => (
                                <div className="col-lg-4 col-md-6" key={item.id}>
                                    <PropertyCard property={item} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>

        </div>

    );
}

export default PropertyDetails;