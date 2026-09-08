import { Link, useLocation } from "react-router-dom";
import {
    FaTachometerAlt,
    FaHome,
    FaCalendarAlt,
    FaMoneyBillWave,
    FaChartBar,
    FaBell,
    FaUser,
    FaCog,
    FaSignOutAlt,
    FaPlus,
    FaIdCard,
    FaFileAlt,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import "../styles/dashboard-layout.css";

function DashboardLayout({ children }) {
    const location = useLocation();
    const { user, logout } = useAuth();
    const role = user?.role?.toUpperCase();

    const commonItems = [
        { name: "Notifications", icon: <FaBell />, path: "/dashboard/notifications" },
        { name: "Profile", icon: <FaUser />, path: "/dashboard/profile" },
        { name: "Settings", icon: <FaCog />, path: "/dashboard/settings" },
    ];

    const tenantItems = [
        { name: "Find Properties", icon: <FaHome />, path: "/properties" },
        { name: "My Applications", icon: <FaFileAlt />, path: "/dashboard/bookings" },
        { name: "My Bookings", icon: <FaCalendarAlt />, path: "/dashboard/bookings" },
        { name: "My Lease", icon: <FaIdCard />, path: "/tenant/my-rentals" },
        { name: "Rent Payments", icon: <FaMoneyBillWave />, path: "/tenant/my-rentals" },
        { name: "Payment History", icon: <FaMoneyBillWave />, path: "/tenant/my-rentals" },
    ];

    const landlordItems = [
        { name: "My Properties", icon: <FaHome />, path: "/dashboard/my-properties" },
        { name: "Add Property", icon: <FaPlus />, path: "/properties/add" },
        { name: "Tenants", icon: <FaUser />, path: "/dashboard/manage-bookings" },
        { name: "Leases", icon: <FaIdCard />, path: "/dashboard/manage-bookings" },
        { name: "Rent Collection", icon: <FaMoneyBillWave />, path: "/dashboard/payments" },
        { name: "Payments", icon: <FaMoneyBillWave />, path: "/dashboard/payments" },
        { name: "Bookings", icon: <FaCalendarAlt />, path: "/dashboard/bookings" },
        { name: "Analytics", icon: <FaChartBar />, path: "/dashboard/analytics" },
    ];

    const agentItems = [
        { name: "My Listings", icon: <FaHome />, path: "/dashboard/my-properties" },
        { name: "Add Property", icon: <FaPlus />, path: "/properties/add" },
        { name: "Clients", icon: <FaUser />, path: "/dashboard/manage-bookings" },
        { name: "Applications", icon: <FaFileAlt />, path: "/dashboard/bookings" },
        { name: "Bookings", icon: <FaCalendarAlt />, path: "/dashboard/bookings" },
        { name: "Analytics", icon: <FaChartBar />, path: "/dashboard/analytics" },
        { name: "Commissions", icon: <FaMoneyBillWave />, path: "/dashboard/payments" },
    ];

    const dashboardItem = {
        name: role === "TENANT" ? "Home" : "Dashboard",
        icon: <FaTachometerAlt />,
        path: "/dashboard",
    };

    const roleItems = role === "TENANT"
        ? tenantItems
        : role === "LANDLORD"
            ? landlordItems
            : role === "AGENT"
                ? agentItems
                : [];

    const menuItems = [dashboardItem, ...roleItems, ...commonItems];

    return (
        <div className="dashboard-wrapper">
            <aside className="sidebar">
                <Link to="/" className="logo text-decoration-none">
                    HomeLink
                </Link>

                <div className="sidebar-user">
                    {user?.profile_photo ? (
                        <img
                            src={user.profile_photo}
                            alt="Profile"
                            className="sidebar-avatar"
                            style={{ objectFit: "cover" }}
                        />
                    ) : (
                        <div className="sidebar-avatar">
                            {user?.first_name?.charAt(0) || "U"}
                        </div>
                    )}
                    <div>
                        <strong>{user?.first_name || "User"}</strong>
                        <small>{role || "USER"}</small>
                    </div>
                </div>

                <ul>
                    {menuItems.map((item) => (
                        <li
                            key={`${item.name}-${item.path}`}
                            className={location.pathname === item.path ? "active" : ""}
                        >
                            <Link to={item.path}>
                                {item.icon}
                                <span>{item.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>

                <button className="logout-btn" onClick={logout}>
                    <FaSignOutAlt />
                    <span>Logout</span>
                </button>
            </aside>

            <main className="dashboard-content">{children}</main>
        </div>
    );
}

export default DashboardLayout;
