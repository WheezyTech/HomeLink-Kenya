import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { API_BASE_URL } from "../../config/api";

const benefits = [
    "Create a professional provider profile",
    "Manage services, pricing, and availability",
    "Receive requests from property owners and tenants",
    "Build trust with a verified marketplace presence"
];

function getAuthConfig() {
    const token = localStorage.getItem("access") || localStorage.getItem("access_token");

    if (!token) {
        return null;
    }

    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
}

function ProviderLandingPage() {
    const [registered, setRegistered] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const checkProviderStatus = async () => {
            const config = getAuthConfig();
            if (!config) {
                setChecking(false);
                return;
            }

            try {
                const response = await axios.get(`${API_BASE_URL}/services/providers/me/`, config);
                setRegistered(Boolean(response.data?.registered));
            } catch (error) {
                setRegistered(false);
            } finally {
                setChecking(false);
            }
        };

        checkProviderStatus();
    }, []);

    return (
        <div className="container py-5">
            <div className="row align-items-center g-5">
                <div className="col-lg-6">
                    <p className="text-uppercase fw-semibold text-primary mb-2">For providers</p>
                    <h1 className="display-6 fw-bold mb-3">Grow your service business with HomeLink Kenya</h1>
                    <p className="text-muted fs-5">
                        This provider page checks the backend service profile status before guiding you to register or manage your dashboard.
                    </p>
                    <div className="d-flex flex-wrap gap-3 mt-4">
                        {checking ? (
                            <button className="btn btn-primary" disabled>Checking account...</button>
                        ) : registered ? (
                            <Link to="/services/provider/dashboard" className="btn btn-primary">Open provider dashboard</Link>
                        ) : (
                            <Link to="/services/provider/register" className="btn btn-primary">Register as provider</Link>
                        )}

                        <Link to="/contact" className="btn btn-outline-secondary">Contact sales</Link>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-4 p-lg-5">
                            <h2 className="h4 fw-bold mb-4">Why providers choose us</h2>
                            <ul className="list-unstyled mb-0">
                                {benefits.map((item) => (
                                    <li className="mb-3" key={item}>• {item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProviderLandingPage;
