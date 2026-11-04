import { Link } from "react-router-dom";

const values = [
    {
        title: "Trust and transparency",
        description: "We help create a safer property marketplace where users can verify listings, identities, and ownership information more confidently."
    },
    {
        title: "Innovation",
        description: "We use digital workflows, smart tools, and streamlined services to make property discovery and management easier."
    },
    {
        title: "Community-first growth",
        description: "We are building a platform that supports tenants, landlords, agents, and property owners across Kenya with practical, user-centered solutions."
    }
];

function AboutPage() {
    return (
        <div className="container py-5">
            <div className="row align-items-center g-5 mb-5">
                <div className="col-lg-6">
                    <p className="text-uppercase fw-semibold text-primary mb-2">About us</p>
                    <h1 className="display-6 fw-bold mb-3">Making property access simpler, safer, and smarter</h1>
                    <p className="text-muted fs-5">
                        HomeLink Kenya is a digital property marketplace designed to help people discover homes, manage listings,
                        verify property opportunities, and connect with trusted agents and service providers across the country.
                    </p>
                    <p className="text-muted">
                        We are building a platform that brings together property search, landlord and agent management, tenant support,
                        verification tools, and service discovery in one place.
                    </p>
                    <div className="d-flex flex-wrap gap-3 mt-4">
                        <Link to="/properties" className="btn btn-primary">Explore properties</Link>
                        <Link to="/contact" className="btn btn-outline-secondary">Contact us</Link>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-4 p-lg-5">
                            <div className="row g-3 text-center">
                                <div className="col-6">
                                    <div className="bg-primary bg-opacity-10 rounded p-4 h-100">
                                        <h3 className="fw-bold mb-0">25k+</h3>
                                        <small className="text-muted">Listings</small>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="bg-primary bg-opacity-10 rounded p-4 h-100">
                                        <h3 className="fw-bold mb-0">1.5k+</h3>
                                        <small className="text-muted">Agents</small>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="bg-primary bg-opacity-10 rounded p-4 h-100">
                                        <h3 className="fw-bold mb-0">24/7</h3>
                                        <small className="text-muted">Support</small>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="bg-primary bg-opacity-10 rounded p-4 h-100">
                                        <h3 className="fw-bold mb-0">Kenya</h3>
                                        <small className="text-muted">Focused</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-5">
                <h2 className="h3 fw-bold mb-4 text-center">Our values</h2>
                <div className="row g-4">
                    {values.map((value) => (
                        <div className="col-md-4" key={value.title}>
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body p-4">
                                    <h3 className="h5 fw-bold mb-3">{value.title}</h3>
                                    <p className="text-muted mb-0">{value.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-body p-4 p-lg-5">
                    <h2 className="h3 fw-bold mb-4">Why HomeLink Kenya</h2>
                    <div className="row g-4">
                        <div className="col-md-6">
                            <ul className="list-unstyled mb-0">
                                <li className="mb-3"><strong>Verified property access:</strong> support for safer listings and identity checks.</li>
                                <li className="mb-3"><strong>Tenant-friendly tools:</strong> property search, booking requests, and rental support.</li>
                                <li className="mb-3"><strong>Agent and landlord enablement:</strong> manage listings and property opportunities efficiently.</li>
                            </ul>
                        </div>
                        <div className="col-md-6">
                            <ul className="list-unstyled mb-0">
                                <li className="mb-3"><strong>Service discovery:</strong> access relevant provider services through the marketplace.</li>
                                <li className="mb-3"><strong>Better transparency:</strong> clearer property information and communication flows.</li>
                                <li className="mb-3"><strong>Local focus:</strong> designed around the needs of Kenya’s property ecosystem.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutPage;
