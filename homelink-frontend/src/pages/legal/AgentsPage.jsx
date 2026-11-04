import { Link } from "react-router-dom";

const agentBenefits = [
    "List and manage verified properties with ease",
    "Reach more buyers and tenants through a trusted marketplace",
    "Communicate with clients through a centralized dashboard",
    "Access support and visibility as a professional property stakeholder"
];

function AgentsPage() {
    return (
        <div className="container py-5">
            <div className="row align-items-center g-5">
                <div className="col-lg-6">
                    <p className="text-uppercase fw-semibold text-primary mb-2">For agents</p>
                    <h1 className="display-6 fw-bold mb-3">Grow your agency with HomeLink Kenya</h1>
                    <p className="text-muted fs-5">
                        Join a property marketplace designed to help agents showcase listings, connect with clients, and build trust.
                    </p>
                    <ul className="list-unstyled mt-4">
                        {agentBenefits.map((item) => (
                            <li className="mb-3" key={item}>• {item}</li>
                        ))}
                    </ul>
                    <div className="d-flex flex-wrap gap-3 mt-4">
                        <Link to="/register" className="btn btn-primary">Register as agent</Link>
                        <Link to="/contact" className="btn btn-outline-secondary">Talk to us</Link>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-4 p-lg-5">
                            <h2 className="h4 fw-bold mb-4">Why join?</h2>
                            <div className="d-grid gap-3">
                                <div className="border rounded p-3">
                                    <strong>Verified exposure</strong>
                                    <p className="text-muted mb-0 mt-2">Display your listings in a trusted property environment built around credibility.</p>
                                </div>
                                <div className="border rounded p-3">
                                    <strong>Client management</strong>
                                    <p className="text-muted mb-0 mt-2">Organize property details, enquiries, and communication through a streamlined workflow.</p>
                                </div>
                                <div className="border rounded p-3">
                                    <strong>Local visibility</strong>
                                    <p className="text-muted mb-0 mt-2">Reach users looking for property opportunities across Kenya.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AgentsPage;
