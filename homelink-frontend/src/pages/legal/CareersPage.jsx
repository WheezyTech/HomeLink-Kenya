import { Link } from "react-router-dom";

const roles = [
    {
        title: "Frontend Developer",
        description: "Build modern, responsive user experiences for tenants, landlords, agents, and service providers."
    },
    {
        title: "Backend Engineer",
        description: "Design scalable APIs, data flows, verification services, and property management workflows."
    },
    {
        title: "Product Operations Lead",
        description: "Coordinate product delivery, user insights, platform operations, and support processes."
    },
    {
        title: "Customer Success Associate",
        description: "Help users onboard, resolve issues, and improve the customer journey across the platform."
    }
];

function CareersPage() {
    return (
        <div className="container py-5">
            <div className="row justify-content-center mb-5">
                <div className="col-lg-8 text-center">
                    <p className="text-uppercase fw-semibold text-primary mb-2">Careers</p>
                    <h1 className="display-6 fw-bold mb-3">Join the HomeLink Kenya team</h1>
                    <p className="text-muted fs-5">
                        We are building the future of property discovery and management in Kenya. If you care about trust, technology,
                        and better user experiences, we’d love to hear from you.
                    </p>
                </div>
            </div>

            <div className="row g-4 mb-5">
                {roles.map((role) => (
                    <div className="col-md-6" key={role.title}>
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body p-4">
                                <h2 className="h4 fw-bold mb-3">{role.title}</h2>
                                <p className="text-muted mb-0">{role.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-body p-4 p-lg-5">
                    <h2 className="h4 fw-bold mb-3">Why work with us?</h2>
                    <ul className="mb-4 text-muted">
                        <li>Work on products that improve access to safe, transparent property opportunities.</li>
                        <li>Collaborate with a team focused on innovation, trust, and user experience.</li>
                        <li>Help shape a digital platform serving tenants, owners, agents, and service providers.</li>
                    </ul>
                    <div className="d-flex flex-wrap gap-3">
                        <Link to="/contact" className="btn btn-primary">Apply now</Link>
                        <Link to="/about" className="btn btn-outline-secondary">Learn more</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CareersPage;
