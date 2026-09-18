import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import authService from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

import "../../styles/auth.css";

function Register() {
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        phone: "",
        role: "TENANT",
        alternative_email: "",
        address: "",
        id_number: "",
        dob: "",
        gender: "",
        occupation: "",
        alternate_phone: "",
        emergency_contact_name: "",
        emergency_contact_phone: "",
        referral_source: "",
        timezone: "",
        language: "en",
        marketing_consent: false,
        mpesa_number: "",
        kra_pin: "",
        password: "",
        confirm_password: "",
    });

    const [idFrontFile, setIdFrontFile] = useState(null);
    const [idBackFile, setIdBackFile] = useState(null);
    const [selfieFile, setSelfieFile] = useState(null);
    const [businessCertFile, setBusinessCertFile] = useState(null);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [passwordChecks, setPasswordChecks] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
    });

    const isLandlordOrAgent =
        formData.role === "LANDLORD" || formData.role === "AGENT";

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        let newValue = type === "checkbox" ? checked : value;

        // Keep KRA PIN uppercase
        if (name === "kra_pin") {
            newValue = value.toUpperCase();
        }

        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));

        if (name === "password") {
            setPasswordChecks(validatePassword(value));
        }
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;

        if (!files || files.length === 0) return;

        const file = files[0];

        if (name === "id_front") {
            setIdFrontFile(file);
        }

        if (name === "id_back") {
            setIdBackFile(file);
        }

        if (name === "selfie") {
            setSelfieFile(file);
        }

        if (name === "business_certificate") {
            setBusinessCertFile(file);
        }
    };

    const validatePassword = (pw) => ({
        length: pw.length >= 8,
        uppercase: /[A-Z]/.test(pw),
        lowercase: /[a-z]/.test(pw),
        number: /[0-9]/.test(pw),
        special: /[!@#$%^&*(),.?"':{}|<>]/.test(pw),
    });

    const validateKraPin = (pin) => {
        return /^[AP]\d{9}[A-Z]$/.test(pin);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const checks = validatePassword(formData.password);

        if (!Object.values(checks).every(Boolean)) {
            setPasswordChecks(checks);
            toast.error("Password does not meet requirements.");
            return;
        }

        if (formData.password !== formData.confirm_password) {
            toast.error("Passwords do not match.");
            return;
        }

        // KRA validation for landlords and agents
        if (isLandlordOrAgent) {
            if (!formData.kra_pin) {
                toast.error("KRA PIN is required for landlords and agents.");
                return;
            }

            if (!validateKraPin(formData.kra_pin)) {
                toast.error(
                    "Enter a valid KRA PIN format, e.g. A123456789B."
                );
                return;
            }
        }

        try {
            let payload;

            const hasFiles =
                idFrontFile ||
                idBackFile ||
                selfieFile ||
                businessCertFile;

            if (hasFiles) {
                payload = new FormData();

                Object.entries(formData).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        if (typeof value === "boolean") {
                            payload.append(
                                key,
                                value ? "true" : "false"
                            );
                        } else {
                            payload.append(key, value);
                        }
                    }
                });

                if (idFrontFile) {
                    payload.append("id_front", idFrontFile);
                }

                if (idBackFile) {
                    payload.append("id_back", idBackFile);
                }

                if (selfieFile) {
                    payload.append("selfie", selfieFile);
                }

                if (businessCertFile) {
                    payload.append(
                        "business_certificate",
                        businessCertFile
                    );
                }
            } else {
                payload = formData;
            }

            const response = await authService.register(payload);

            toast.success("Account created successfully.");

            /*
             * IMPORTANT:
             *
             * We no longer automatically log in landlords/agents.
             *
             * Their KRA/account verification may require manual review.
             */

            if (isLandlordOrAgent) {
                navigate("/verify-phone", {
                    state: {
                        phone: formData.phone,
                        registration: true,
                        verificationRequired: true,
                        kraVerification: true,
                    },
                });
            } else {
                navigate("/verify-phone", {
                    state: {
                        phone: formData.phone,
                    },
                });
            }
        } catch (err) {
            console.error("Registration error:", err);

            const data = err.response?.data;

            let message = "Registration failed.";

            if (data?.detail) {
                message = data.detail;
            } else if (data?.message) {
                message = data.message;
            } else if (typeof data === "object") {
                const firstError = Object.values(data)[0];

                if (Array.isArray(firstError)) {
                    message = firstError[0];
                } else if (typeof firstError === "string") {
                    message = firstError;
                }
            }

            toast.error(message);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">

                <div className="auth-logo">
                    🏠 HomeLink
                </div>

                <h2 className="auth-title">
                    Create Account
                </h2>

                <p className="auth-subtitle">
                    Join HomeLink Kenya today
                </p>

                <form onSubmit={handleSubmit}>

                    {/* ROLE */}
                    <div className="mb-3">
                        <select
                            className="form-select"
                            name="role"
                            onChange={handleChange}
                            value={formData.role}
                        >
                            <option value="TENANT">
                                Tenant
                            </option>

                            <option value="LANDLORD">
                                Landlord
                            </option>

                            <option value="AGENT">
                                Agent
                            </option>
                        </select>
                    </div>

                    {/* NAMES */}
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="First Name"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Last Name"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* DOB / GENDER */}
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <input
                                type="date"
                                className="form-control"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <select
                                className="form-select"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                            >
                                <option value="">
                                    Select Gender
                                </option>

                                <option value="MALE">
                                    Male
                                </option>

                                <option value="FEMALE">
                                    Female
                                </option>

                                <option value="OTHER">
                                    Other
                                </option>
                            </select>
                        </div>
                    </div>

                    {/* USERNAME */}
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* EMAIL */}
                    <div className="mb-3">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Email Address"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* PHONE */}
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Phone Number"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    {/* ALTERNATIVE EMAIL */}
                    <div className="mb-3">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Alternative Email (optional)"
                            name="alternative_email"
                            value={formData.alternative_email}
                            onChange={handleChange}
                        />
                    </div>

                    {/* ADDRESS */}
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Address (Permanent)"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>

                    {/* ID NUMBER */}
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="ID Number (national ID)"
                            name="id_number"
                            value={formData.id_number}
                            onChange={handleChange}
                            required={isLandlordOrAgent}
                        />

                        {isLandlordOrAgent && (
                            <small className="text-danger">
                                Required for landlords and agents
                            </small>
                        )}
                    </div>

                    {/* LANDLORD DOCUMENTS */}
                    {formData.role === "LANDLORD" && (
                        <>
                            <div className="mb-3">
                                <label>
                                    ID Front (image)
                                </label>

                                <input
                                    type="file"
                                    name="id_front"
                                    accept="image/*"
                                    className="form-control"
                                    onChange={handleFileChange}
                                />
                            </div>

                            <div className="mb-3">
                                <label>
                                    ID Back (image)
                                </label>

                                <input
                                    type="file"
                                    name="id_back"
                                    accept="image/*"
                                    className="form-control"
                                    onChange={handleFileChange}
                                />
                            </div>

                            <div className="mb-3">
                                <label>
                                    Passport / Selfie (image)
                                </label>

                                <input
                                    type="file"
                                    name="selfie"
                                    accept="image/*"
                                    className="form-control"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </>
                    )}

                    {/* AGENT DOCUMENTS */}
                    {formData.role === "AGENT" && (
                        <div className="mb-3">
                            <label>
                                Business Registration Certificate
                            </label>

                            <input
                                type="file"
                                name="business_certificate"
                                accept="application/pdf,image/*"
                                className="form-control"
                                onChange={handleFileChange}
                            />
                        </div>
                    )}

                    {/* KRA PIN */}
                    {isLandlordOrAgent && (
                        <div className="mb-3">
                            <label className="form-label">
                                KRA PIN
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="e.g. A123456789B"
                                name="kra_pin"
                                value={formData.kra_pin}
                                onChange={handleChange}
                                maxLength={11}
                                required
                                autoComplete="off"
                            />

                            <small className="text-muted">
                                Your KRA PIN will be checked during
                                verification. If automatic verification
                                cannot confirm your tax registration,
                                your account will be sent for manual review.
                            </small>
                        </div>
                    )}

                    {/* OCCUPATION */}
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Occupation/Profession"
                            name="occupation"
                            value={formData.occupation}
                            onChange={handleChange}
                        />
                    </div>

                    {/* ALTERNATE PHONE */}
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Alternate Phone"
                            name="alternate_phone"
                            value={formData.alternate_phone}
                            onChange={handleChange}
                        />
                    </div>

                    {/* REFERRAL */}
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Referral Source (optional)"
                            name="referral_source"
                            value={formData.referral_source}
                            onChange={handleChange}
                        />
                    </div>

                    {/* LANGUAGE */}
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <select
                                className="form-select"
                                name="language"
                                onChange={handleChange}
                                value={formData.language}
                            >
                                <option value="en">
                                    English
                                </option>

                                <option value="sw">
                                    Swahili
                                </option>
                            </select>
                        </div>
                    </div>

                    {/* MPESA */}
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Payment Details (M-Pesa Number)"
                            name="mpesa_number"
                            value={formData.mpesa_number}
                            onChange={handleChange}
                            required={formData.role === "LANDLORD"}
                        />

                        <small className="text-muted">
                            Required for landlords.
                        </small>
                    </div>

                    {/* MARKETING */}
                    <div className="form-check mb-3">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            name="marketing_consent"
                            checked={formData.marketing_consent}
                            onChange={handleChange}
                        />

                        <label className="form-check-label">
                            I agree to receive marketing communications
                            (optional)
                        </label>
                    </div>

                    {/* PASSWORD */}
                    <div className="mb-3 position-relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                            placeholder="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                        <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary password-toggle"
                            onClick={() =>
                                setShowPassword((s) => !s)
                            }
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div className="mb-4 position-relative">
                        <input
                            type={
                                showConfirmPassword
                                    ? "text"
                                    : "password"
                            }
                            className="form-control"
                            placeholder="Confirm Password"
                            name="confirm_password"
                            value={formData.confirm_password}
                            onChange={handleChange}
                            required
                        />

                        <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary password-toggle"
                            onClick={() =>
                                setShowConfirmPassword((s) => !s)
                            }
                        >
                            {showConfirmPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    {/* PASSWORD REQUIREMENTS */}
                    <div className="mb-3 password-requirements">
                        <small>
                            Password must have:
                        </small>

                        <ul>
                            <li
                                className={
                                    passwordChecks.length
                                        ? "pass"
                                        : "fail"
                                }
                            >
                                At least 8 characters
                            </li>

                            <li
                                className={
                                    passwordChecks.uppercase
                                        ? "pass"
                                        : "fail"
                                }
                            >
                                An uppercase letter (A-Z)
                            </li>

                            <li
                                className={
                                    passwordChecks.lowercase
                                        ? "pass"
                                        : "fail"
                                }
                            >
                                A lowercase letter (a-z)
                            </li>

                            <li
                                className={
                                    passwordChecks.number
                                        ? "pass"
                                        : "fail"
                                }
                            >
                                A number (0-9)
                            </li>

                            <li
                                className={
                                    passwordChecks.special
                                        ? "pass"
                                        : "fail"
                                }
                            >
                                A special character
                            </li>
                        </ul>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-auth"
                    >
                        Create Account
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account?{" "}
                    <Link to="/login">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Register;