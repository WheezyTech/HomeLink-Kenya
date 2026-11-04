import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

import { API_BASE_URL } from "../../config/api";

const initialForm = {
    full_name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
};

function ContactPage() {
    const [formData, setFormData] = useState(initialForm);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);

        try {
            await axios.post(`${API_BASE_URL}/contact/submit/`, formData);
            toast.success("Your message has been sent successfully.");
            setFormData(initialForm);
        } catch (error) {
            console.error(error);
            toast.error(
                error.response?.data?.message ||
                    error.response?.data?.detail ||
                    "Unable to send your message right now. Please try again later."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row g-5 align-items-start justify-content-center">
                <div className="col-lg-5">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body p-4 p-lg-5">
                            <p className="text-uppercase fw-semibold text-primary mb-2">Contact</p>
                            <h1 className="display-6 fw-bold mb-3">We’re here to help</h1>
                            <p className="text-muted mb-4">
                                Whether you’re a tenant, landlord, agent, or property owner, our support team is ready to assist.
                            </p>

                            <div className="d-flex flex-column gap-3">
                                <div className="d-flex align-items-start gap-3">
                                    <div className="bg-primary bg-opacity-10 rounded-circle p-3 text-primary">
                                        <i className="bi bi-telephone-fill" aria-label="Phone" />
                                    </div>
                                    <div>
                                        <h6 className="fw-bold mb-1">Call us</h6>
                                        <p className="mb-0 text-muted">+254 112 174 245</p>
                                    </div>
                                </div>

                                <div className="d-flex align-items-start gap-3">
                                    <div className="bg-primary bg-opacity-10 rounded-circle p-3 text-primary">
                                        <i className="bi bi-envelope-fill" aria-label="Email" />
                                    </div>
                                    <div>
                                        <h6 className="fw-bold mb-1">Email</h6>
                                        <p className="mb-0 text-muted">support@homelinkkenya.co.ke</p>
                                    </div>
                                </div>

                                <div className="d-flex align-items-start gap-3">
                                    <div className="bg-primary bg-opacity-10 rounded-circle p-3 text-primary">
                                        <i className="bi bi-geo-alt-fill" aria-label="Location" />
                                    </div>
                                    <div>
                                        <h6 className="fw-bold mb-1">Office</h6>
                                        <p className="mb-0 text-muted">Eldoret, Kenya</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-7">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4 p-lg-5">
                            <h2 className="h4 fw-bold mb-4">Send us a message</h2>

                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Full name</label>
                                        <input
                                            type="text"
                                            name="full_name"
                                            className="form-control"
                                            placeholder="Your name"
                                            value={formData.full_name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Email address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control"
                                            placeholder="you@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Phone number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            className="form-control"
                                            placeholder="+254..."
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Subject</label>
                                        <input
                                            type="text"
                                            name="subject"
                                            className="form-control"
                                            placeholder="How can we help?"
                                            value={formData.subject}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label">Message</label>
                                        <textarea
                                            name="message"
                                            className="form-control"
                                            rows="6"
                                            placeholder="Tell us more about your enquiry..."
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-12 d-flex flex-wrap gap-3">
                                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                                            {submitting ? "Sending..." : "Send message"}
                                        </button>
                                        <Link to="/" className="btn btn-outline-secondary">Back to home</Link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactPage;
