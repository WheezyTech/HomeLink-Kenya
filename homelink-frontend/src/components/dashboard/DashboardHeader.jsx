import { FaBell, FaHeart, FaUserCircle } from "react-icons/fa";

function DashboardHeader() {

    const today = new Date().toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (

        <div className="d-flex justify-content-between align-items-center mb-4">

            <div>

                <h2 className="fw-bold">
                    Dashboard
                </h2>

                <p className="text-muted mb-0">

                    Welcome back 👋

                </p>

                <small>{today}</small>

            </div>

            <div className="d-flex gap-4 align-items-center">

                <FaHeart size={22} />

                <FaBell size={22} />

                <FaUserCircle size={35} />

            </div>

        </div>

    );

}

export default DashboardHeader;