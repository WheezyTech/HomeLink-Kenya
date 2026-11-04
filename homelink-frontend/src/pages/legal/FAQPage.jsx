import { Link } from "react-router-dom";

const faqs = [
    {
        question: "What is HomeLink Kenya?",
        answer:
            "HomeLink Kenya is a digital property marketplace that connects tenants, landlords, buyers, agents, and property owners with a safer and more transparent way to discover, verify, and manage property opportunities."
    },
    {
        question: "Do I need an account to search for properties?",
        answer:
            "You can browse many listings without registering, but an account is needed for actions such as saving searches, booking views, submitting requests, messaging, and managing your dashboard."
    },
    {
        question: "How do I verify my account?",
        answer:
            "After registration, you may be asked to provide identity, document, or ownership information depending on your role. Verification helps reduce fraud and improves trust across the platform."
    },
    {
        question: "Can landlords and agents list properties?",
        answer:
            "Yes. Verified landlords and agents can create property listings, manage property information, and interact with prospective tenants or buyers in line with the platform rules."
    },
    {
        question: "How do I report a suspicious listing or scam?",
        answer:
            "Use the report option on the listing or contact our support team through the contact page. We review reports to protect users and maintain platform integrity."
    },
    {
        question: "Is my personal information protected?",
        answer:
            "Yes. HomeLink Kenya applies data protection principles to handle personal data responsibly and lawfully in line with Kenya's data protection framework and platform privacy policy."
    },
    {
        question: "How are bookings made?",
        answer:
            "Users can request a viewing or booking through a property listing. The landlord or agent may then confirm the request, depending on the listing and its available process."
    },
    {
        question: "Can I contact support if I need help?",
        answer:
            "Yes. Please visit the Help Centre or Contact page for account support, property support, and general inquiries."
    }
];

function FAQPage() {
    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-9">
                    <div className="text-center mb-5">
                        <p className="text-uppercase fw-semibold text-primary mb-2">Support</p>
                        <h1 className="display-6 fw-bold mb-3">Frequently Asked Questions</h1>
                        <p className="text-muted mx-auto" style={{ maxWidth: "720px" }}>
                            Everything you need to know about using HomeLink Kenya, managing your listings, and staying safe on the platform.
                        </p>
                    </div>

                    <div className="accordion" id="faqAccordion">
                        {faqs.map((item, index) => (
                            <div className="accordion-item" key={item.question}>
                                <h2 className="accordion-header" id={`faq-heading-${index}`}>
                                    <button
                                        className="accordion-button collapsed"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target={`#faq-collapse-${index}`}
                                        aria-expanded="false"
                                        aria-controls={`faq-collapse-${index}`}
                                    >
                                        {item.question}
                                    </button>
                                </h2>
                                <div
                                    id={`faq-collapse-${index}`}
                                    className="accordion-collapse collapse"
                                    aria-labelledby={`faq-heading-${index}`}
                                    data-bs-parent="#faqAccordion"
                                >
                                    <div className="accordion-body text-muted">{item.answer}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-5">
                        <p className="text-muted mb-3">Still have another question?</p>
                        <div className="d-flex flex-wrap justify-content-center gap-3">
                            <Link to="/help-centre" className="btn btn-primary">Visit Help Centre</Link>
                            <Link to="/contact" className="btn btn-outline-secondary">Contact support</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FAQPage;
