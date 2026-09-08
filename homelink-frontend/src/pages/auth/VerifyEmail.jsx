import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../api/axios";

function VerifyEmail() {
    const { token } = useParams();

    const [status, setStatus] = useState("verifying");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await api.get(
                    `auth/verify-email/${token}/`
                );

                setStatus("success");
                setMessage(
                    response.data.message ||
                    "Email verified successfully."
                );

            } catch (error) {
                setStatus("error");

                setMessage(
                    error.response?.data?.message ||
                    "Email verification failed."
                );
            }
        };

        verifyEmail();
    }, [token]);

    return (
        <div className="container py-5">

            <div
                className="card shadow-sm mx-auto p-5 text-center"
                style={{ maxWidth: "500px" }}
            >

                {status === "verifying" && (
                    <>
                        <h2>Verifying Email...</h2>
                        <p className="text-muted">
                            Please wait while we verify your email.
                        </p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="display-4 mb-3">
                            ✅
                        </div>

                        <h2>Email Verified!</h2>

                        <p className="text-muted">
                            {message}
                        </p>

                        <Link
                            to="/login"
                            className="btn btn-primary"
                        >
                            Continue to Login
                        </Link>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="display-4 mb-3">
                            ❌
                        </div>

                        <h2>Verification Failed</h2>

                        <p className="text-danger">
                            {message}
                        </p>

                        <Link
                            to="/register"
                            className="btn btn-primary"
                        >
                            Back to Registration
                        </Link>
                    </>
                )}

            </div>

        </div>
    );
}

export default VerifyEmail;