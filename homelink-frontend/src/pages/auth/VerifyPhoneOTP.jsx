import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaMobileAlt } from "react-icons/fa";
import { toast } from "react-toastify";

import api from "../../api/axios";

function VerifyPhoneOTP() {

    const navigate = useNavigate();
    const location = useLocation();

    const params = new URLSearchParams(
        location.search
    );

    const phone =
        location.state?.phone ||
        params.get("phone") ||
        "";

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);

    const handleResend = async () => {

        if (!phone) {
            toast.error("Phone number is missing.");
            return;
        }

        try {

            setResending(true);

            await api.post(
                "auth/resend-phone-otp/",
                {
                    phone,
                }
            );

            toast.success(
                "A new OTP has been sent."
            );

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Unable to resend OTP."
            );

        } finally {

            setResending(false);
        }
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!/^\d{6}$/.test(otp)) {

            toast.error(
                "Please enter the 6-digit OTP."
            );

            return;
        }

        if (!phone) {

            toast.error(
                "Phone number is missing."
            );

            return;
        }

        try {

            setLoading(true);

            const response = await api.post(
                "auth/verify-phone/",
                {
                    phone,
                    otp,
                }
            );

            toast.success(
                response.data.message ||
                "Phone number verified successfully."
            );

            setTimeout(() => {

                navigate("/login");

            }, 1000);

        } catch (error) {

            console.error(
                "Phone OTP verification error:",
                error.response?.data ||
                error.message
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
                        <FaMobileAlt />
                    </div>

                    <h2 className="fw-bold">
                        Verify Phone Number
                    </h2>

                    <p className="text-muted">
                        Enter the 6-digit OTP sent to
                    </p>

                    <strong>
                        {phone}
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
                            : "Verify Phone"
                        }

                    </button>

                    <button
                        type="button"
                        className="btn btn-link w-100 mt-2"
                        onClick={handleResend}
                        disabled={resending}
                    >
                        {resending
                            ? "Sending..."
                            : "Resend OTP"
                        }
                    </button>

                </form>

                <div className="text-center mt-4">

                    <Link
                        to="/register"
                        className="text-decoration-none"
                    >
                        <FaArrowLeft />
                        &nbsp; Back to Registration
                    </Link>

                </div>

            </div>

        </div>

    );
}

export default VerifyPhoneOTP;