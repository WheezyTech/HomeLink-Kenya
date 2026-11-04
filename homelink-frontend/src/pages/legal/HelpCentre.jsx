import { Link } from "react-router-dom";

const faqs = [
    {
        question: "How do I list a property?",
        answer:
            "Create an account, verify your identity, and then go to the property listing form to add your property details, pricing, and photos."
    },
    {
        question: "How do I schedule a viewing?",
        answer:
            "Open the property listing and use the booking or viewing request button to send a request to the landlord or agent."
    },
    {
        question: "What documents do I need to verify my account?",
        answer:
            "Depending on your account type, you may need a national ID, KRA PIN, business registration documents, or ownership documents for property listing verification."
    },
    {
        question: "How are payments handled?",
        answer:
            "Payments and tenancy transactions are managed through the platform's secure payment flow, and all users are expected to follow the platform terms and payment procedures."
    },
    {
        question: "How do I report a suspicious listing or scam?",
        answer:
            "Use the reporting option on the relevant property or service listing, or contact the support team through the contact page."
    }
];

function HelpCentre() {
    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <div className="text-center mb-5">
                        <p className="text-uppercase fw-semibold text-primary mb-2">Support</p>
                        <h1 className="display-6 fw-bold mb-3">Help Centre</h1>
                        <p className="text-muted mx-auto" style={{ maxWidth: "720px" }}>
                            Find answers to common questions and get the support you need as a tenant, landlord, agent, or property owner.
                        </p>
                    </div>

                    <div className="row g-4 mb-5">
                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body text-center p-4">
                                    <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 56, height: 56 }}>
                                        <i className="bi bi-person-badge-fill fs-4 text-primary" aria-label="Account" />
                                    </div>
                                    <h5 className="fw-bold">Account help</h5>
                                    <p className="text-muted mb-0">Account setup, verification, password reset, and profile updates.</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body text-center p-4">
                                    <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 56, height: 56 }}>
                                        <i className="bi bi-building-fill fs-4 text-primary" aria-label="Properties" />
                                    </div>
                                    <h5 className="fw-bold">Property support</h5>
                                    <p className="text-muted mb-0">Listings, bookings, ownership proof, and property management questions.</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body text-center p-4">
                                    <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 56, height: 56 }}>
                                        <i className="bi bi-shield-fill-check fs-4 text-primary" aria-label="Safety" />
                                    </div>
                                    <h5 className="fw-bold">Safety & reports</h5>
                                    <p className="text-muted mb-0">Fraud prevention, suspicious listings, safety reports, and dispute support.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card shadow-sm border-0 mb-5">
                        <div className="card-body p-4 p-lg-5">
                            <h2 className="h4 fw-bold mb-4">Frequently asked questions</h2>
                            <div className="accordion" id="helpAccordion">
                                {faqs.map((faq, index) => (
                                    <div className="accordion-item" key={faq.question}>
                                        <h3 className="accordion-header" id={`heading-${index}`}>
                                            <button
                                                className="accordion-button collapsed"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target={`#collapse-${index}`}
                                                aria-expanded="false"
                                                aria-controls={`collapse-${index}`}
                                            >
                                                {faq.question}
                                            </button>
                                        </h3>
                                        <div
                                            id={`collapse-${index}`}
                                            className="accordion-collapse collapse"
                                            aria-labelledby={`heading-${index}`}
                                            data-bs-parent="#helpAccordion"
                                        >
                                            <div className="accordion-body text-muted">{faq.answer}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <h2 className="h4 fw-bold mb-3">Still need help?</h2>
                        <p className="text-muted mb-4">Contact our support team for personalized help with your account, listings, or platform concerns.</p>
                        <div className="d-flex flex-wrap justify-content-center gap-3">
                            <Link to="/contact" className="btn btn-primary">Contact support</Link>
                            <Link to="/" className="btn btn-outline-secondary">Back to home</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HelpCentre;
