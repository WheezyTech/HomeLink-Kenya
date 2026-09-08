import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import AnalyticsChart from "../../components/dashboard/AnalyticsChart";
import StatsCard from "../../components/dashboard/StatsCard";
import SubscriptionCard from "../../components/dashboard/SubscriptionCard";
import dashboardService from "../../services/dashboardService";
import "../../styles/dashboard.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import TenantDashboard from "./TenantDashboard";
import LandlordDashboard from "./LandlordDashboard";
import AgentDashboard from "./AgentDashboard";

import {
    FaHome,
    FaEye,
    FaCalendarAlt,
    FaComments,
} from "react-icons/fa";

function Dashboard() {

    const { user } = useAuth();
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const normalizedRole = user?.role?.toUpperCase();

    if (normalizedRole === "TENANT") {
        return <TenantDashboard />;
    }

    if (normalizedRole === "LANDLORD") {
        return <LandlordDashboard />;
    }

    if (normalizedRole === "AGENT") {
        return <AgentDashboard />;
    }

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await dashboardService.getDashboard();

            console.log("Dashboard API response:", response);

            // Handle common api_response structures
            const data =
                response?.data?.data ||
                response?.data ||
                response;

            setDashboard(data);

        } catch (error) {

            console.error(
                "Dashboard loading error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load dashboard."
            );

        } finally {

            setLoading(false);

        }
    };

    return (

        <DashboardLayout>

            <div className="container-fluid p-4">

                <DashboardHeader />

                {loading && (

                    <div className="text-center py-5">

                        <div
                            className="spinner-border text-primary"
                            role="status"
                        />

                        <p className="mt-3 text-muted">
                            Loading your dashboard...
                        </p>

                    </div>

                )}

                {!loading && error && (

                    <div className="alert alert-danger">

                        <strong>
                            Dashboard error:
                        </strong>{" "}

                        {error}

                        <button
                            className="btn btn-sm btn-danger ms-3"
                            onClick={loadDashboard}
                        >
                            Try Again
                        </button>

                    </div>

                )}

                {!loading && !error && dashboard && (

                    <>

                        <div className="dashboard-container">

                            <div className="row g-4">

                                <div className="col-md-3">

                                    <StatsCard
                                        title="Properties"
                                        value={
                                            dashboard.total_properties || 0
                                        }
                                        icon={<FaHome />}
                                        color="#2563eb"
                                    />

                                </div>

                                <div className="col-md-3">

                                    <StatsCard
                                        title="Bookings"
                                        value={
                                            dashboard.total_bookings || 0
                                        }
                                        icon={<FaCalendarAlt />}
                                        color="#10b981"
                                    />

                                </div>

                                <div className="col-md-3">

                                    <StatsCard
                                        title="Views"
                                        value={
                                            dashboard.total_views || 0
                                        }
                                        icon={<FaEye />}
                                        color="#f59e0b"
                                    />

                                </div>

                                <div className="col-md-3">

                                    <StatsCard
                                        title="Chats"
                                        value={
                                            dashboard.total_chats || 0
                                        }
                                        icon={<FaComments />}
                                        color="#8b5cf6"
                                    />

                                </div>

                            </div>

                            <div className="card shadow border-0 mt-4">

                                <div className="card-body">

                                    <h5 className="mb-3">
                                        Quick Actions
                                    </h5>

                                    <div className="d-flex flex-wrap gap-3">

                                        <Link
                                            to="/properties/add"
                                            className="btn btn-primary"
                                        >
                                            + Add Property
                                        </Link>

                                        <Link
                                            to="/dashboard/bookings"
                                            className="btn btn-success"
                                        >
                                            View Bookings
                                        </Link>

                                        <Link
                                            to="/dashboard/payments"
                                            className="btn btn-warning"
                                        >
                                            Payments
                                        </Link>

                                        <Link
                                            to="/properties"
                                            className="btn btn-dark"
                                        >
                                            Browse Properties
                                        </Link>

                                    </div>

                                </div>

                            </div>

                        </div>

                        <div className="row mt-4">

                            <div className="col-lg-6">

                                <SubscriptionCard
                                    dashboard={dashboard}
                                />

                            </div>

                            <div className="col-lg-6">

                                <AnalyticsChart
                                    data={
                                        dashboard.chartData || []
                                    }
                                />

                            </div>

                        </div>

                    </>

                )}

            </div>

        </DashboardLayout>

    );
}

export default Dashboard;