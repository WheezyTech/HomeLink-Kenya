import { useState } from "react";
import {
    Link,
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    FaArrowLeft,
    FaEye,
    FaEyeSlash,
    FaLock,
} from "react-icons/fa";

import { toast } from "react-toastify";

import api from "../../api/axios";

function ResetPassword() {

    const navigate = useNavigate();
    const location = useLocation();

    const params = new URLSearchParams(
        location.search
    );

    const email = params.get("email") || "";
    const otp = params.get("otp") || "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);


    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!email || !otp) {

            toast.error(
                "Invalid password reset request."
            );

            return;
        }

        if (password.length < 8) {

            toast.error(
                "Password must contain at least 8 characters."
            );

            return;
        }

        if (password !== confirmPassword) {

            toast.error(
                "Passwords do not match."
            );

            return;
        }

        try {

            setLoading(true);

            await api.post(
                "auth/reset-password/",
                {
                    email,
                    otp,
                    password,
                    confirm_password: confirmPassword,
                }
            );

            toast.success(
                "Password reset successfully!"
            );

            navigate("/login");

        } catch (error) {

            console.error(
                "Password reset error:",
                error.response?.data || error.message
            );

            const data = error.response?.data;

            toast.error(
                data?.message ||
                "Unable to reset password."
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
                        Create New Password
                    </h2>

                    <p className="text-muted">
                        Choose a strong password for your
                        HomeLink account.
                    </p>

                </div>


                <form onSubmit={handleSubmit}>

                    {/* New password */}

                    <div className="mb-3">

                        <label className="form-label">
                            New Password
                        </label>

                        <div className="input-group">

                            <span className="input-group-text">
                                <FaLock />
                            </span>

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                className="form-control"
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(
                                        e.target.value
                                    )
                                }
                                required
                            />

                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                            >

                                {showPassword
                                    ? <FaEyeSlash />
                                    : <FaEye />
                                }

                            </button>

                        </div>

                    </div>


                    {/* Confirm password */}

                    <div className="mb-3">

                        <label className="form-label">
                            Confirm Password
                        </label>

                        <div className="input-group">

                            <span className="input-group-text">
                                <FaLock />
                            </span>

                            <input
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                className="form-control"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(
                                        e.target.value
                                    )
                                }
                                required
                            />

                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                            >

                                {showConfirmPassword
                                    ? <FaEyeSlash />
                                    : <FaEye />
                                }

                            </button>

                        </div>

                    </div>


                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={loading}
                    >

                        {loading
                            ? "Resetting Password..."
                            : "Reset Password"
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

export default ResetPassword;