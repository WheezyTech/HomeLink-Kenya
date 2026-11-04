import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getServiceCategories, getServiceListings } from "../../services/servicesApi";

function ServicesPage() {
    const [categories, setCategories] = useState([]);
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError("");

                const [categoriesData, listingsData] = await Promise.all([
                    getServiceCategories(),
                    getServiceListings(),
                ]);

                setCategories(categoriesData || []);
                setListings(listingsData.results || listingsData || []);
            } catch (fetchError) {
                console.error(fetchError);
                setError("Unable to load services right now. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="container py-5">
            <div className="row justify-content-center mb-5">
                <div className="col-lg-8 text-center">
                    <p className="text-uppercase fw-semibold text-primary mb-2">Our services</p>
                    <h1 className="display-6 fw-bold mb-3">HomeLink Services marketplace</h1>
                    <p className="text-muted fs-5">
                        Browse verified providers and service listings from the HomeLink Kenya backend.
                    </p>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger">{error}</div>
            )}

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status" />
                    <p className="mt-3 text-muted">Loading services...</p>
                </div>
            ) : (
                <>
                    {categories.length > 0 && (
                        <div className="mb-4">
                            <h2 className="h5 fw-bold mb-3">Categories</h2>
                            <div className="d-flex flex-wrap gap-2">
                                {categories.map((category) => (
                                    <span key={category.id} className="badge bg-light text-dark border py-2 px-3">
                                        {category.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="row g-4 mb-5">
                        {listings.length > 0 ? (
                            listings.map((listing) => (
                                <div className="col-md-6 col-lg-4" key={listing.id}>
                                    <div className="card border-0 shadow-sm h-100">
                                        <div className="card-body p-4 d-flex flex-column">
                                            <span className="badge bg-primary-subtle text-primary align-self-start mb-3">
                                                {listing.category?.name || listing.category || "Service"}
                                            </span>
                                            <h3 className="h5 fw-bold mb-2">{listing.title}</h3>
                                            <p className="text-muted flex-grow-1">
                                                {listing.description?.slice(0, 120) || "No description available."}
                                                {listing.description && listing.description.length > 120 ? "..." : ""}
                                            </p>
                                            <div className="d-flex justify-content-between align-items-center mt-3">
                                                <span className="fw-bold">KSh {listing.price}</span>
                                                <span className="text-muted small">
                                                    {listing.provider?.business_name || "Provider"}
                                                </span>
                                            </div>
                                            <Link to={`/services/${listing.id}`} className="btn btn-primary mt-4">
                                                View details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-12">
                                <div className="alert alert-info">No service listing data is currently available from the backend.</div>
                            </div>
                        )}
                    </div>

                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-4 p-lg-5">
                            <h2 className="h4 fw-bold mb-3">Built for trusted property transactions</h2>
                            <p className="text-muted mb-4">
                                Whether you are a tenant, landlord, agent, or service provider, HomeLink Kenya uses backend-powered workflows to support listings, requests, and verifications.
                            </p>
                            <div className="d-flex flex-wrap gap-3">
                                <Link to="/services" className="btn btn-primary">Browse marketplace</Link>
                                <Link to="/contact" className="btn btn-outline-secondary">Book a demo</Link>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default ServicesPage;
