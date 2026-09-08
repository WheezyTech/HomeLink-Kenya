import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaKey } from "react-icons/fa";
import { toast } from "react-toastify";

import api from "../../api/axios";

function VerifyOTP() {

    const navigate = useNavigate();
    const location = useLocation();

    const params = new URLSearchParams(
        location.search
    );

    const email = params.get("email") || "";

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!/^\d{6}$/.test(otp)) {

            toast.error(
                "Please enter the 6-digit OTP."
            );

            return;
        }

        try {

            setLoading(true);

            await api.post(
                "auth/verify-otp/",
                {
                    email,
                    otp,
                }
            );

            toast.success(
                "OTP verified successfully."
            );

            navigate(
                `/reset-password?email=${encodeURIComponent(email)}&otp=${otp}`
            );

        } catch (error) {

            console.error(
                "OTP verification error:",
                error.response?.data || error.message
            );

            toast.error(
                error.response?.data?.message ||
                "Invalid or expired OTP."
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
                        <FaKey />
                    </div>

                    <h2 className="fw-bold">
                        Verify OTP
                    </h2>

                    <p className="text-muted">
                        Enter the 6-digit OTP sent to
                    </p>

                    <strong>
                        {email}
                    </strong>

                </div>


                <form onSubmit={handleSubmit}>

                    <div className="mb-3">

                        <label className="form-label">
                            Verification Code
                        </label>

                        <input
                            type="text"
                            className="form-control text-center"
                            placeholder="000000"
                            value={otp}
                            onChange={(e) =>
                                setOtp(
                                    e.target.value
                                        .replace(/\D/g, "")
                                        .slice(0, 6)
                                )
                            }
                            inputMode="numeric"
                            maxLength={6}
                            required
                        />

                    </div>


                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={loading}
                    >

                        {loading
                            ? "Verifying..."
                            : "Verify OTP"
                        }

                    </button>

                </form>


                <div className="text-center mt-4">

                    <Link
                        to="/forgot-password"
                        className="text-decoration-none"
                    >
                        <FaArrowLeft />
                        &nbsp; Request New OTP
                    </Link>

                </div>

            </div>

        </div>

    );
}

export default VerifyOTP;