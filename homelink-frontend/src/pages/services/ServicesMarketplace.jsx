import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    getServiceCategories,
    getServiceListings,
} from "../../services/servicesApi";

function ServicesMarketplace() {
    const [categories, setCategories] = useState([]);
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMarketplace = async () => {
            try {
                const [categoriesData, listingsData] = await Promise.all([
                    getServiceCategories(),
                    getServiceListings(),
                ]);

                setCategories(categoriesData || []);
                setListings(listingsData.results || listingsData || []);
            } catch (fetchError) {
                console.error("Failed to load services marketplace:", fetchError);
                setError("Unable to load the HomeLink Services marketplace. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchMarketplace();
    }, []);

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status" />
                <p className="mt-3">Loading HomeLink Services marketplace...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5 text-center">
                <h3>{error}</h3>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="mb-4">
                <h1>HomeLink Services Marketplace</h1>
                <p className="text-muted">
                    Browse verified service providers and listings from across Kenya.
                </p>
            </div>

            {categories.length > 0 && (
                <div className="mb-4">
                    <h5>Popular Categories</h5>
                    <div className="d-flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <span
                                key={category.id}
                                className="badge bg-light border text-dark py-2 px-3"
                            >
                                {category.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className="row g-4">
                {listings.length > 0 ? (
                    listings.map((listing) => (
                        <div className="col-md-6 col-lg-4" key={listing.id}>
                            <div className="card shadow-sm border-0 h-100">
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{listing.title}</h5>
                                    <p className="card-text text-muted mb-2">
                                        {listing.category?.name || listing.category}
                                    </p>
                                    <p className="card-text mb-3">
                                        {listing.description ? listing.description.slice(0, 120) : "No description available."}
                                        {listing.description && listing.description.length > 120 && "..."}
                                    </p>
                                    <div className="mt-auto">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <span className="fw-bold">Ksh {listing.price}</span>
                                            <span className="badge bg-primary">
                                                {listing.provider?.business_name || "Provider"}
                                            </span>
                                        </div>
                                        <div className="d-flex gap-2 flex-wrap">
                                            {listing.is_featured && <span className="badge bg-success">Featured</span>}
                                            {listing.is_available === false && <span className="badge bg-secondary">Unavailable</span>}
                                        </div>
                                        <Link
                                            to={`/services/${listing.id}`}
                                            className="btn btn-outline-primary btn-sm mt-3"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <div className="alert alert-info">No service listings available at the moment.</div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ServicesMarketplace;
