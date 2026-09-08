import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaHeart,
    FaCalendarAlt,
    FaComments,
    FaSearch,
    FaBell,
} from "react-icons/fa";

import DashboardLayout from "../../layouts/DashboardLayout";
import dashboardService from "../../services/dashboardService";

function TenantDashboard() {

    const [dashboard, setDashboard] = useState(null);

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                const data =
                    await dashboardService.getDashboard();

                setDashboard(data);

            } catch (error) {

                console.error(
                    "Tenant dashboard error:",
                    error
                );

            }

        };

        loadDashboard();

    }, []);

    return (

        <DashboardLayout>

            <div className="container-fluid p-4">

                {/* Welcome */}

                <div className="mb-4">

                    <h2 className="fw-bold">

                        Welcome back
                        {dashboard?.user?.first_name
                            ? `, ${dashboard.user.first_name}`
                            : ""} 👋

                    </h2>

                    <p className="text-muted">

                        Find your next home, track your favourites,
                        and manage your viewings with ease.

                    </p>

                </div>


                {/* Search */}

                <div className="card border-0 shadow-sm mb-4">

                    <div className="card-body p-4">

                        <h5 className="fw-bold mb-3">

                            Find Your Next Home

                        </h5>

                        <div className="row g-2">

                            <div className="col-md-9">

                                <div className="input-group">

                                    <span className="input-group-text">

                                        <FaSearch />

                                    </span>

                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search houses, apartments, locations..."
                                    />

                                </div>

                            </div>

                            <div className="col-md-3">

                                <Link
                                    to="/properties"
                                    className="btn btn-primary w-100"
                                >
                                    Search Properties
                                </Link>

                            </div>

                        </div>

                    </div>

                </div>


                {/* Statistics */}

                <div className="row g-4 mb-4">

                    <div className="col-md-4">

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body">

                                <div className="d-flex justify-content-between">

                                    <div>

                                        <p className="text-muted mb-1">
                                            Favourites
                                        </p>

                                        <h3 className="fw-bold">

                                            {dashboard?.total_favourites || 0}

                                        </h3>

                                    </div>

                                    <FaHeart
                                        size={30}
                                        className="text-danger"
                                    />

                                </div>

                                <Link
                                    to="/dashboard/favourites"
                                    className="small text-decoration-none"
                                >
                                    View saved properties →
                                </Link>

                            </div>

                        </div>

                    </div>


                    <div className="col-md-4">

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body">

                                <div className="d-flex justify-content-between">

                                    <div>

                                        <p className="text-muted mb-1">
                                            My Bookings
                                        </p>

                                        <h3 className="fw-bold">

                                            {dashboard?.total_bookings || 0}

                                        </h3>

                                    </div>

                                    <FaCalendarAlt
                                        size={30}
                                        className="text-success"
                                    />

                                </div>

                                <Link
                                    to="/dashboard/bookings"
                                    className="small text-decoration-none"
                                >
                                    View bookings →
                                </Link>

                            </div>

                        </div>

                    </div>


                    <div className="col-md-4">

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body">

                                <div className="d-flex justify-content-between">

                                    <div>

                                        <p className="text-muted mb-1">
                                            Messages
                                        </p>

                                        <h3 className="fw-bold">

                                            {dashboard?.total_chats || 0}

                                        </h3>

                                    </div>

                                    <FaComments
                                        size={30}
                                        className="text-primary"
                                    />

                                </div>

                                <Link
                                    to="/dashboard/chat"
                                    className="small text-decoration-none"
                                >
                                    Open messages →
                                </Link>

                            </div>

                        </div>

                    </div>

                </div>


                {/* Quick actions */}

                <div className="card border-0 shadow-sm">

                    <div className="card-body p-4">

                        <h5 className="fw-bold mb-4">

                            Quick Actions

                        </h5>

                        <div className="row g-3">

                            <div className="col-md-4">

                                <Link
                                    to="/properties"
                                    className="btn btn-primary w-100 py-3"
                                >

                                    <FaSearch className="me-2" />

                                    Browse Properties

                                </Link>

                            </div>

                            <div className="col-md-4">

                                <Link
                                    to="/dashboard/favourites"
                                    className="btn btn-outline-danger w-100 py-3"
                                >

                                    <FaHeart className="me-2" />

                                    My Favourites

                                </Link>

                            </div>

                            <div className="col-md-4">

                                <Link
                                    to="/dashboard/bookings"
                                    className="btn btn-outline-success w-100 py-3"
                                >

                                    <FaCalendarAlt className="me-2" />

                                    My Bookings

                                </Link>

                            </div>

                        </div>

                    </div>

                </div>


                {/* Helpful information */}

                <div className="alert alert-light border mt-4">

                    <FaBell className="me-2 text-primary" />

                    <strong>Tip:</strong> Save properties you're
                    interested in so you can easily revisit them later.

                </div>

            </div>

        </DashboardLayout>

    );

}

export default TenantDashboard;