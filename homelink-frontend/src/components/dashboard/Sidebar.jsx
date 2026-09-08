import { NavLink } from "react-router-dom";
import {
    FaHome,
    FaBuilding,
    FaPlusCircle,
    FaCalendarCheck,
    FaCreditCard,
    FaChartBar,
    FaBell,
    FaUser,
    FaCog,
    FaSignOutAlt,
    FaFileContract,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";

function Sidebar() {
    const { user } = useAuth();
    const userRole = user?.role?.toUpperCase();

    const menuItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: <FaHome />,
        },

        {
            name: "My Properties",
            path: "/dashboard/my-properties",
            icon: <FaBuilding />,
            roles: ["LANDLORD", "AGENT"],
        },

        {
            name: "Add Property",
            path: "/properties/add",
            icon: <FaPlusCircle />,
            roles: ["LANDLORD", "AGENT"],
        },

        {
            name: "My Rentals",
            path: "/tenant/my-rentals",
            icon: <FaFileContract />,
            roles: ["TENANT"],
        },

        {
            name: "Bookings",
            path: "/dashboard/bookings",
            icon: <FaCalendarCheck />,
        },

        {
            name: "Payments",
            path: "/dashboard/payments",
            icon: <FaCreditCard />,
        },

        {
            name: "Analytics",
            path: "/dashboard/analytics",
            icon: <FaChartBar />,
            roles: ["LANDLORD", "AGENT"],
        },

        {
            name: "Notifications",
            path: "/dashboard/notifications",
            icon: <FaBell />,
        },

        {
            name: "Profile",
            path: "/dashboard/profile",
            icon: <FaUser />,
        },

        {
            name: "Settings",
            path: "/dashboard/settings",
            icon: <FaCog />,
        },
    ];

    const visibleItems = menuItems.filter((item) => {
        if (!item.roles) {
            return true;
        }

        return item.roles.includes(userRole);
    });

    return (
        <div
            className="bg-dark text-white p-3"
            style={{
                width: "260px",
                minHeight: "100vh",
            }}
        >
            <h3 className="mb-4 text-center">
                HomeLink Kenya
            </h3>

            {visibleItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                        `d-flex align-items-center text-decoration-none text-white p-2 rounded mb-2 ${
                            isActive ? "bg-primary" : ""
                        }`
                    }
                >
                    <span className="me-3">
                        {item.icon}
                    </span>

                    {item.name}
                </NavLink>
            ))}

            <hr />

            <NavLink
                to="/login"
                className="d-flex align-items-center text-decoration-none text-danger p-2"
            >
                <FaSignOutAlt className="me-3" />

                Logout
            </NavLink>
        </div>
    );
}

export default Sidebar;