import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
    FaSearch,
    FaHeart,
    FaUserCircle,
    FaPlus
} from "react-icons/fa";

import NotificationBell from "../../components/notifications/NotificationBell";
import favouriteService from "../../services/favouriteService";

import "../../styles/navbar.css";

function Navbar() {

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [favouriteCount, setFavouriteCount] = useState(0);

    const loadFavouriteCount = async () => {

        if (!user) {
            setFavouriteCount(0);
            return;
        }

        try {

            const response = await favouriteService.getFavourites();
            const favourites = Array.isArray(response)
                ? response
                : response?.results || response?.data || [];

            setFavouriteCount(favourites.length);

        } catch (error) {

            console.error("Failed to load favourites:", error);

        }

    };

    /*
    |--------------------------------------------------------------------------
    | Load notifications when user logs in
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadFavouriteCount();

        const interval = setInterval(() => {

            loadFavouriteCount();

        }, 30000);

        return () => clearInterval(interval);

    }, [user]);


    /*
    |--------------------------------------------------------------------------
    | Logout
    |--------------------------------------------------------------------------
    */

    const handleLogout = () => {

        logout();

        navigate("/");

    };


    return (

        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">

            <div className="container">

                {/* ---------------------------------------------------------
                    BRAND
                --------------------------------------------------------- */}

                <Link
                    className="navbar-brand fw-bold fs-2 text-primary"
                    to="/"
                >
                    🏠 HomeLink
                </Link>


                {/* ---------------------------------------------------------
                    MOBILE MENU BUTTON
                --------------------------------------------------------- */}

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >

                    <span className="navbar-toggler-icon"></span>

                </button>


                {/* ---------------------------------------------------------
                    NAVIGATION
                --------------------------------------------------------- */}

                <div
                    className="collapse navbar-collapse"
                    id="navbarNav"
                >

                    <ul className="navbar-nav mx-auto">

                        <li className="nav-item">

                            <Link
                                className="nav-link"
                                to="/"
                            >
                                Home
                            </Link>

                        </li>


                        <li className="nav-item">

                            <Link
                                className="nav-link"
                                to="/properties"
                            >
                                Properties
                            </Link>

                        </li>


                        <li className="nav-item">

                            <Link
                                className="nav-link"
                                to="/rent"
                            >
                                Rent
                            </Link>

                        </li>


                        <li className="nav-item">

                            <Link
                                className="nav-link"
                                to="/buy"
                            >
                                Buy
                            </Link>

                        </li>


                        <li className="nav-item">

                            <Link
                                className="nav-link"
                                to="/agents"
                            >
                                Agents
                            </Link>

                        </li>

                    </ul>


                    {/* ---------------------------------------------------------
                        SEARCH
                    --------------------------------------------------------- */}

                    <form
                        className="d-flex me-3"
                        onSubmit={(e) => e.preventDefault()}
                    >

                        <div className="input-group">

                            <span className="input-group-text">

                                <FaSearch />

                            </span>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search property..."
                            />

                        </div>

                    </form>


                    {/* ---------------------------------------------------------
                        USER AREA
                    --------------------------------------------------------- */}

                    <div className="d-flex align-items-center gap-3">

                        {user ? (

                            <>

                                {/* -------------------------------------------------
                                    NOTIFICATIONS
                                ------------------------------------------------- */}

                                <NotificationBell />


                                {/* -------------------------------------------------
                                    FAVOURITES
                                ------------------------------------------------- */}

                                <Link
                                    to="/dashboard/favourites"
                                    className="position-relative text-dark"
                                    title="Favourites"
                                >

                                    <FaHeart className="fs-5" />

                                    {favouriteCount > 0 && (

                                        <span
                                            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                            style={{
                                                fontSize: "0.65rem",
                                                minWidth: "18px"
                                            }}
                                        >
                                            {favouriteCount > 99
                                                ? "99+"
                                                : favouriteCount
                                            }
                                        </span>

                                    )}

                                </Link>


                                {/* -------------------------------------------------
                                    POST PROPERTY
                                    LANDLORD + AGENT ONLY
                                ------------------------------------------------- */}

                                {(user.role === "LANDLORD" ||
                                  user.role === "AGENT") && (

                                    <Link
                                        to="/properties/add"
                                        className="btn btn-primary rounded-pill"
                                    >

                                        <FaPlus />

                                        &nbsp;

                                        Post Property

                                    </Link>

                                )}


                                {/* -------------------------------------------------
                                    USER DROPDOWN
                                ------------------------------------------------- */}

                                <div className="dropdown">

                                    <button
                                        className="btn btn-light dropdown-toggle"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >

                                        <FaUserCircle className="me-2" />

                                        {user.first_name ||
                                         user.username ||
                                         "Account"}

                                    </button>


                                    <ul className="dropdown-menu dropdown-menu-end">

                                        {/* Dashboard */}

                                        <li>

                                            <Link
                                                className="dropdown-item"
                                                to="/dashboard"
                                            >
                                                Dashboard
                                            </Link>

                                        </li>


                                        {/* Profile */}

                                        <li>

                                            <Link
                                                className="dropdown-item"
                                                to="/dashboard/profile"
                                            >
                                                My Profile
                                            </Link>

                                        </li>

                                        <li>

                                            <Link
                                                className="dropdown-item"
                                                to="/dashboard/bookings"
                                            >
                                                My Bookings
                                            </Link>

                                        </li>

                                        {(user.role === "LANDLORD" ||
                                          user.role === "AGENT") && (

                                            <li>

                                                <Link
                                                    className="dropdown-item"
                                                    to="/dashboard/manage-bookings"
                                                >
                                                    Viewing Requests
                                                </Link>

                                            </li>

                                        )}


                                        {/* -------------------------------------------------
                                            MY PROPERTIES
                                            LANDLORD + AGENT ONLY
                                        ------------------------------------------------- */}

                                        {(user.role === "LANDLORD" ||
                                          user.role === "AGENT") && (

                                            <li>

                                                <Link
                                                    className="dropdown-item"
                                                    to="/dashboard/my-properties"
                                                >
                                                    My Properties
                                                </Link>

                                            </li>

                                        )}


                                        {/* Notifications */}

                                        <li>

                                            <Link
                                                className="dropdown-item d-flex justify-content-between align-items-center"
                                                to="/dashboard/notifications"
                                            >

                                                <span>
                                                    Notifications
                                                </span>

                                            </Link>

                                        </li>


                                        {/* Divider */}

                                        <li>
                                            <hr className="dropdown-divider" />
                                        </li>


                                        {/* Logout */}

                                        <li>

                                            <button
                                                className="dropdown-item text-danger"
                                                onClick={handleLogout}
                                            >
                                                Logout
                                            </button>

                                        </li>

                                    </ul>

                                </div>

                            </>

                        ) : (

                            <>

                                {/* -------------------------------------------------
                                    GUEST
                                ------------------------------------------------- */}

                                <Link
                                    to="/login"
                                    className="btn btn-outline-primary"
                                >
                                    Login
                                </Link>


                                <Link
                                    to="/register"
                                    className="btn btn-primary"
                                >
                                    Register
                                </Link>

                            </>

                        )}

                    </div>

                </div>

            </div>

        </nav>

    );

}

export default Navbar;