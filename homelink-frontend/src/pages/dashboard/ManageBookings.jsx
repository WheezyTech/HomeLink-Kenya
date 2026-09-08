import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import DashboardLayout from "../../layouts/DashboardLayout";
import bookingService from "../../services/bookingService";

function ManageBookings() {

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {

        try {

            const response =
                await bookingService.getIncomingBookings();

            const data = Array.isArray(response)
                ? response
                : response.results || [];

            setBookings(data);

        } catch (error) {

            console.error(error);

            toast.error(
                "Failed to load booking requests."
            );

        } finally {

            setLoading(false);
        }
    };

    const acceptBooking = async (booking) => {

        const notes = window.prompt(
            "Optional note for the tenant:"
        );

        try {

            await bookingService.acceptBooking(
                booking.id,
                notes || ""
            );

            toast.success(
                "Viewing request accepted."
            );

            loadBookings();

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to accept booking."
            );
        }
    };

    const rejectBooking = async (booking) => {

        const notes = window.prompt(
            "Reason or note for rejection:"
        );

        try {

            await bookingService.rejectBooking(
                booking.id,
                notes || ""
            );

            toast.success(
                "Viewing request rejected."
            );

            loadBookings();

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to reject booking."
            );
        }
    };

    const checkIn = async (booking) => {

        try {

            await bookingService.checkInBooking(
                booking.id
            );

            toast.success(
                "Tenant checked in."
            );

            loadBookings();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to check in."
            );
        }
    };

    const complete = async (booking) => {

        try {

            await bookingService.completeBooking(
                booking.id
            );

            toast.success(
                "Viewing completed."
            );

            loadBookings();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to complete viewing."
            );
        }
    };

    const statusBadge = (status) => {

        const classes = {
            PENDING: "bg-warning text-dark",
            ACCEPTED: "bg-success",
            REJECTED: "bg-danger",
            CANCELLED: "bg-secondary",
            COMPLETED: "bg-primary",
        };

        return (
            <span
                className={`badge ${
                    classes[status] ||
                    "bg-secondary"
                }`}
            >
                {status}
            </span>
        );
    };

    return (

        <DashboardLayout>

            <div className="container py-4">

                <div className="mb-4">

                    <h2>
                        Viewing Requests
                    </h2>

                    <p className="text-muted">
                        Manage requests from tenants who
                        want to view your properties.
                    </p>

                </div>

                {loading ? (

                    <div className="text-center py-5">

                        <div
                            className="spinner-border text-primary"
                        />

                        <p className="mt-3">
                            Loading requests...
                        </p>

                    </div>

                ) : bookings.length === 0 ? (

                    <div className="alert alert-info">

                        You have no viewing requests.

                    </div>

                ) : (

                    <div className="row g-4">

                        {bookings.map((booking) => (

                            <div
                                className="col-12 col-lg-6"
                                key={booking.id}
                            >

                                <div className="card shadow-sm h-100">

                                    <div className="card-body">

                                        <div className="d-flex justify-content-between">

                                            <div>

                                                <h5>
                                                    {booking.property_title}
                                                </h5>

                                                <small className="text-muted">
                                                    Viewing Request
                                                </small>

                                            </div>

                                            {statusBadge(
                                                booking.status
                                            )}

                                        </div>

                                        <hr />

                                        <h6>
                                            Tenant
                                        </h6>

                                        <p className="mb-1">
                                            <strong>
                                                Name:
                                            </strong>{" "}
                                            {booking.tenant_name}
                                        </p>

                                        <p className="mb-1">
                                            <strong>
                                                Email:
                                            </strong>{" "}
                                            {booking.tenant_email}
                                        </p>

                                        <p>
                                            <strong>
                                                Phone:
                                            </strong>{" "}
                                            {booking.tenant_phone}
                                        </p>

                                        <hr />

                                        <p>
                                            <strong>
                                                Date:
                                            </strong>{" "}
                                            {booking.viewing_date}
                                        </p>

                                        <p>
                                            <strong>
                                                Time:
                                            </strong>{" "}
                                            {booking.viewing_time}
                                        </p>

                                        <p>
                                            <strong>
                                                Type:
                                            </strong>{" "}
                                            {booking.meeting_type ===
                                            "VIRTUAL"
                                                ? "Virtual Tour"
                                                : "Physical Viewing"}
                                        </p>

                                        {booking.message && (

                                            <div className="alert alert-light">

                                                <strong>
                                                    Tenant message:
                                                </strong>

                                                <p className="mb-0">
                                                    {booking.message}
                                                </p>

                                            </div>

                                        )}

                                        {booking.owner_notes && (

                                            <div className="alert alert-info">

                                                <strong>
                                                    Your notes:
                                                </strong>

                                                <p className="mb-0">
                                                    {booking.owner_notes}
                                                </p>

                                            </div>

                                        )}

                                        <div className="d-flex flex-wrap gap-2 mt-3">

                                            {booking.status ===
                                                "PENDING" && (

                                                <>

                                                    <button
                                                        className="btn btn-success"
                                                        onClick={() =>
                                                            acceptBooking(
                                                                booking
                                                            )
                                                        }
                                                    >
                                                        Accept
                                                    </button>

                                                    <button
                                                        className="btn btn-outline-danger"
                                                        onClick={() =>
                                                            rejectBooking(
                                                                booking
                                                            )
                                                        }
                                                    >
                                                        Reject
                                                    </button>

                                                </>

                                            )}

                                            {booking.status ===
                                                "ACCEPTED" &&
                                                !booking.checked_in && (

                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() =>
                                                        checkIn(
                                                            booking
                                                        )
                                                    }
                                                >
                                                    Check In
                                                </button>

                                            )}

                                            {booking.status ===
                                                "ACCEPTED" &&
                                                booking.checked_in && (

                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() =>
                                                        complete(
                                                            booking
                                                        )
                                                    }
                                                >
                                                    Mark Completed
                                                </button>

                                            )}

                                        </div>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </DashboardLayout>
    );
}

export default ManageBookings;