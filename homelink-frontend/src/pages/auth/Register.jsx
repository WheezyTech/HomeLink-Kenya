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
        password: "",
        confirm_password: "",
    });

    const [idFrontFile, setIdFrontFile] = useState(null);
    const [idBackFile, setIdBackFile] = useState(null);
    const [selfieFile, setSelfieFile] = useState(null);
    const [kraPinFile, setKraPinFile] = useState(null);
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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
        if (name === "password") setPasswordChecks(validatePassword(value));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (!files || files.length === 0) return;
        const file = files[0];
        if (name === "id_front") setIdFrontFile(file);
        if (name === "id_back") setIdBackFile(file);
        if (name === "selfie") setSelfieFile(file);
        if (name === "kra_pin") setKraPinFile(file);
        if (name === "business_certificate") setBusinessCertFile(file);
    };

    const validatePassword = (pw) => ({
        length: pw.length >= 8,
        uppercase: /[A-Z]/.test(pw),
        lowercase: /[a-z]/.test(pw),
        number: /[0-9]/.test(pw),
        special: /[!@#$%^&*(),.?"':{}|<>]/.test(pw),
    });

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

        try {
            let payload;
            const hasFiles = idFrontFile || idBackFile || selfieFile || kraPinFile || businessCertFile;
            if (hasFiles) {
                payload = new FormData();
                Object.entries(formData).forEach(([k, v]) => {
                    if (v !== undefined && v !== null) {
                        if (typeof v === "boolean") payload.append(k, v ? "true" : "false");
                        else payload.append(k, v);
                    }
                });
                if (idFrontFile) payload.append("id_front", idFrontFile);
                if (idBackFile) payload.append("id_back", idBackFile);
                if (selfieFile) payload.append("selfie", selfieFile);
                if (kraPinFile) payload.append("kra_pin", kraPinFile);
                if (businessCertFile) payload.append("business_certificate", businessCertFile);
            } else {
                payload = formData;
            }

            await authService.register(payload);
            toast.success("Account created successfully");

            if (formData.role === "LANDLORD" || formData.role === "AGENT") {
                try {
                    const loginResp = await authService.login({ email: formData.email, password: formData.password });
                    const loggedInUser = loginResp?.data?.user;
                    if (loggedInUser) setUser(loggedInUser);
                    navigate("/dashboard");
                } catch (loginErr) {
                    navigate("/verify-phone", { state: { phone: formData.phone } });
                }
            } else {
                navigate("/verify-phone", { state: { phone: formData.phone } });
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">🏠 HomeLink</div>
                <h2 className="auth-title">Create Account</h2>
                <p className="auth-subtitle">Join HomeLink Kenya today</p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <select className="form-select" name="role" onChange={handleChange} value={formData.role}>
                            <option value="TENANT">Tenant</option>
                            <option value="LANDLORD">Landlord</option>
                            <option value="AGENT">Agent</option>
                        </select>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <input type="text" className="form-control" placeholder="First Name" name="first_name" onChange={handleChange} required />
                        </div>
                        <div className="col-md-6 mb-3">
                            <input type="text" className="form-control" placeholder="Last Name" name="last_name" onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <input type="date" className="form-control" placeholder="Date of Birth" name="dob" onChange={handleChange} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <select className="form-select" name="gender" onChange={handleChange}>
                                <option value="">Select Gender</option>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-3">
                        <input type="text" className="form-control" placeholder="Username" name="username" onChange={handleChange} required />
                    </div>

                    <div className="mb-3">
                        <input type="email" className="form-control" placeholder="Email Address" name="email" onChange={handleChange} required />
                    </div>

                    <div className="mb-3">
                        <input type="text" className="form-control" placeholder="Phone Number" name="phone" onChange={handleChange} />
                    </div>

                    <div className="mb-3">
                        <input type="email" className="form-control" placeholder="Alternative Email (optional)" name="alternative_email" onChange={handleChange} />
                    </div>

                    <div className="mb-3">
                        <input type="text" className="form-control" placeholder="Address (Permanent)" name="address" onChange={handleChange} />
                    </div>

                    <div className="mb-3">
                        <input type="text" className="form-control" placeholder="ID Number (national ID)" name="id_number" onChange={handleChange} required={formData.role === 'LANDLORD' || formData.role === 'AGENT'} />
                        {(formData.role === 'LANDLORD' || formData.role === 'TENANT' || formData.role === 'AGENT') && (<small className="text-danger">Required for landlords and agents</small>)}
                    </div>

                    {formData.role === 'LANDLORD' && (
                        <>
                            <div className="mb-3">
                                <label>ID Front (image)</label>
                                <input type="file" name="id_front" accept="image/*" className="form-control" onChange={handleFileChange} />
                            </div>
                            <div className="mb-3">
                                <label>ID Back (image)</label>
                                <input type="file" name="id_back" accept="image/*" className="form-control" onChange={handleFileChange} />
                            </div>
                            <div className="mb-3">
                                <label>Passport / Selfie (image)</label>
                                <input type="file" name="selfie" accept="image/*" className="form-control" onChange={handleFileChange} />
                            </div>
                            <div className="mb-3">
                                <label>KRA PIN (file)</label>
                                <input type="file" name="kra_pin" accept="application/pdf,image/*" className="form-control" onChange={handleFileChange} />
                            </div>
                        </>
                    )}

                    {formData.role === 'AGENT' && (
                        <>
                            <div className="mb-3">
                                <label>Business Registration Certificate (file)</label>
                                <input type="file" name="business_certificate" accept="application/pdf,image/*" className="form-control" onChange={handleFileChange} />
                            </div>
                            <div className="mb-3">
                                <label>KRA PIN Certificate(file)</label>
                                <input type="file" name="kra_pin" accept="application/pdf,image/*" className="form-control" onChange={handleFileChange} />
                            </div>
                        </>
                    )}

                    <div className="mb-3">
                        <input type="text" className="form-control" placeholder="Occupation/Profession" name="occupation/Profession" onChange={handleChange} />
                    </div>

                    <div className="mb-3">
                        <input type="text" className="form-control" placeholder="Alternate Phone" name="alternate_phone" onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <input type="text" className="form-control" placeholder="Referral Source (optional)" name="referral_source" onChange={handleChange} />
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <select className="form-select" name="language" onChange={handleChange} value={formData.language}>
                                <option value="en">English</option>
                                <option value="sw">Swahili</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-3">
                        <input type="text" className="form-control" placeholder="Payment Details (M-Pesa Number)" name="mpesa_number" onChange={handleChange} required={formData.role === 'LANDLORD'} />
                        {formData.role === 'LANDLORD' || formData.role === 'AGENT' || formData.role === 'TENANT' ? (<small className="text-danger">Required for Users</small>) : null}
                    </div>

                    <div className="form-check mb-3">
                        <input className="form-check-input" type="checkbox" name="marketing_consent" checked={formData.marketing_consent} onChange={handleChange} />
                        <label className="form-check-label">I agree to receive marketing communications (optional)</label>
                    </div>

                    <div className="mb-3 position-relative">
                        <input type={showPassword ? "text" : "password"} className="form-control" placeholder="Password" name="password" onChange={handleChange} required />
                        <button type="button" className="btn btn-sm btn-outline-secondary password-toggle" onClick={() => setShowPassword(s => !s)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? "Hide" : "Show"}</button>
                    </div>

                    <div className="mb-4 position-relative">
                        <input type={showConfirmPassword ? "text" : "password"} className="form-control" placeholder="Confirm Password" name="confirm_password" onChange={handleChange} required />
                        <button type="button" className="btn btn-sm btn-outline-secondary password-toggle" onClick={() => setShowConfirmPassword(s => !s)} aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}>{showConfirmPassword ? "Hide" : "Show"}</button>
                    </div>

                    <div className="mb-3 password-requirements">
                        <small>Password must have:</small>
                        <ul>
                            <li className={passwordChecks.length ? 'pass' : 'fail'}>At least 8 characters</li>
                            <li className={passwordChecks.uppercase ? 'pass' : 'fail'}>An uppercase letter (A-Z)</li>
                            <li className={passwordChecks.lowercase ? 'pass' : 'fail'}>A lowercase letter (a-z)</li>
                            <li className={passwordChecks.number ? 'pass' : 'fail'}>A number (0-9)</li>
                            <li className={passwordChecks.special ? 'pass' : 'fail'}>A special character (e.g. !@#$%)</li>
                        </ul>
                    </div>

                    <button className="btn btn-primary btn-auth">Create Account</button>
                </form>

                <div className="auth-footer">Already have an account? <Link to="/login">Login</Link></div>
            </div>
        </div>
    );
}

export default Register;
