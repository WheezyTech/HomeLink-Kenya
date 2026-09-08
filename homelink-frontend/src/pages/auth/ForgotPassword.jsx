import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEnvelope, FaLock } from "react-icons/fa";
import { toast } from "react-toastify";

import api from "../../api/axios";

function ForgotPassword() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!email.trim()) {
            toast.error("Please enter your email address.");
            return;
        }

        try {

            setLoading(true);

            await api.post(
                "auth/forgot-password/",
                {
                    email: email.trim(),
                }
            );

            toast.success(
                "If the email exists, an OTP has been sent."
            );

            navigate(
                `/verify-otp?email=${encodeURIComponent(email.trim())}`
            );

        } catch (error) {

            console.error(
                "Forgot password error:",
                error.response?.data || error.message
            );

            toast.error(
                error.response?.data?.message ||
                "Unable to process your request."
            );

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="auth-page">

            <div className="auth-card">

                <div className="text-center mb-4">

                    <div className="auth-icon">
                        <FaLock />
                    </div>

                    <h2 className="fw-bold">
                        Forgot Password?
                    </h2>

                    <p className="text-muted">
                        Enter your email and we'll send you
                        a verification OTP.
                    </p>

                </div>


                <form onSubmit={handleSubmit}>

                    <div className="mb-3">

                        <label className="form-label">
                            Email Address
                        </label>

                        <div className="input-group">

                            <span className="input-group-text">
                                <FaEnvelope />
                            </span>

                            <input
                                type="email"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                            />

                        </div>

                    </div>


                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={loading}
                    >

                        {loading
                            ? "Sending OTP..."
                            : "Send OTP"
                        }

                    </button>

                </form>


                <div className="text-center mt-4">

                    <Link
                        to="/login"
                        className="text-decoration-none"
                    >
                        <FaArrowLeft />
                        &nbsp; Back to Login
                    </Link>

                </div>

            </div>

        </div>

    );
}

export default ForgotPassword;