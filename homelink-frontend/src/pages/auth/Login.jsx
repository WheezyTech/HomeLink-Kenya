import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import authService from "../../services/authService";

import "../../styles/auth.css";

function Login() {

    const navigate = useNavigate();
    const { setUser } = useAuth();

    const [formData,setFormData]=useState({
        email:"",
        password:"",
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange=(e)=>{

        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

    };

    const handleSubmit=async(e)=>{

        e.preventDefault();

        try{

            const rawIdentifier = formData.email.trim();
            const normalizedIdentifier = rawIdentifier.includes("@")
                ? rawIdentifier.toLowerCase()
                : rawIdentifier;

            const payload = {
                email: normalizedIdentifier,
                password: formData.password,
            };

            const response = await authService.login(payload);
            const loggedInUser = response?.data?.user;

            if(loggedInUser){
                setUser(loggedInUser);
            }

            toast.success("Login successful");

            navigate("/dashboard");

        }catch(error){

            const backendMessage =
                error.response?.data?.message ||
                error.response?.data?.data?.non_field_errors?.[0] ||
                error.response?.data?.data?.detail ||
                "Invalid email or password";

            toast.error(backendMessage);

        }

    };

    return(

        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-logo">

                    🏠 HomeLink

                </div>

                <h2 className="auth-title">

                    Welcome Back

                </h2>

                <p className="auth-subtitle">

                    Login to your account

                </p>

                <form onSubmit={handleSubmit}>

                    <div className="mb-3">

                        <input

                            type="text"

                            className="form-control"

                            placeholder="Email or phone"

                            name="email"

                            value={formData.email}

                            onChange={handleChange}

                            required

                        />

                    </div>

                    <div className="mb-4 position-relative">
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
                            onClick={() => setShowPassword((s) => !s)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    <div className="text-end mb-3">

                        <Link
                            to="/forgot-password"
                            className="text-decoration-none"
                        >
                            Forgot Password?
                        </Link>

                    </div>

                    <button

                        className="btn btn-primary btn-auth"

                    >

                        Login

                    </button>

                </form>

                <div className="auth-footer">

                    Don't have an account?

                    <Link to="/register">

                        Register

                    </Link>

                </div>

            </div>

        </div>

    );

}

export default Login;