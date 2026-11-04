import { Link } from "react-router-dom";

const posts = [
    {
        title: "How to choose a safe rental in Kenya",
        summary: "A practical guide to identifying red flags, verifying listings, and protecting yourself as a tenant."
    },
    {
        title: "Tips for landlords managing verified listings",
        summary: "Learn how to improve trust, reduce fraud risk, and present your property professionally online."
    },
    {
        title: "What agents should know about digital property trust",
        summary: "How transparency, verification, and better communication can improve trust with buyers and renters."
    }
];

function BlogPage() {
    return (
        <div className="container py-5">
            <div className="row justify-content-center mb-5">
                <div className="col-lg-8 text-center">
                    <p className="text-uppercase fw-semibold text-primary mb-2">Insights</p>
                    <h1 className="display-6 fw-bold mb-3">HomeLink Kenya Blog</h1>
                    <p className="text-muted fs-5">
                        Advice, trends, and practical insights for tenants, landlords, agents, and property stakeholders.
                    </p>
                </div>
            </div>

            <div className="row g-4">
                {posts.map((post) => (
                    <div className="col-md-4" key={post.title}>
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body p-4">
                                <span className="badge bg-primary-subtle text-primary mb-3">Property Insights</span>
                                <h2 className="h4 fw-bold mb-3">{post.title}</h2>
                                <p className="text-muted mb-4">{post.summary}</p>
                                <Link to="/contact" className="btn btn-outline-primary btn-sm">Read more</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BlogPage;
