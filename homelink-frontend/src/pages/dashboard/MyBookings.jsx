import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import DashboardLayout from "../../layouts/DashboardLayout";
import bookingService from "../../services/bookingService";
import api from "../../api/axios";

function MyBookings() {
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [leases, setLeases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBookingsAndLeases();
    }, []);

    const loadBookingsAndLeases = async () => {
        try {
            const [bookingResponse, leaseResponse] = await Promise.all([
                bookingService.getBookings(),
                api.get("/leases/"),
            ]);

            setBookings(
                Array.isArray(bookingResponse)
                    ? bookingResponse
                    : bookingResponse.results || []
            );
            setLeases(
                Array.isArray(leaseResponse.data)
                    ? leaseResponse.data
                    : leaseResponse.data.results || []
            );
        } catch (error) {
            console.error(error);
            toast.error("Failed to load your bookings.");
        } finally {
            setLoading(false);
        }
    };

    const loadBookings = async () => {

        try {

            const response = await bookingService.getBookings();

            /*
             * Our backend currently returns an array
             * from the ViewSet.
             */
            setBookings(
                Array.isArray(response)
                    ? response
                    : response.results || []
            );

        } catch (error) {

            console.error(error);

            toast.error(
                "Failed to load your bookings."
            );

        } finally {

            setLoading(false);

        }
    };

    const handleCancel = async (booking) => {

        const confirmed = window.confirm(
            "Are you sure you want to cancel this viewing?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await bookingService.cancelBooking(
                booking.id,
                "Cancelled by tenant."
            );

            toast.success(
                "Viewing cancelled successfully."
            );

            loadBookingsAndLeases();

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to cancel booking."
            );
        }
    };

    const getLeaseForBooking = (booking) =>
        leases.find((lease) => String(lease.property) === String(booking.property));

    const requestLease = async (booking) => {
        try {
            const response = await bookingService.requestLease(booking.id);
            toast.success("Lease created. Review and sign it.");
            await loadBookingsAndLeases();
            navigate(`/rentals/${response.lease_id}`);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to create the lease."
            );
        }
    };

    const getStatusClass = (status) => {

        switch (status) {

            case "PENDING":
                return "bg-warning text-dark";

            case "ACCEPTED":
                return "bg-success";

            case "REJECTED":
                return "bg-danger";

            case "CANCELLED":
                return "bg-secondary";

            case "COMPLETED":
                return "bg-primary";

            default:
                return "bg-secondary";
        }
    };

    if (loading) {

        return (
            <DashboardLayout>

                <div className="container py-4">

                    <div className="text-center">

                        <div
                            className="spinner-border text-primary"
                            role="status"
                        />

                        <p className="mt-3">
                            Loading bookings...
                        </p>

                    </div>

                </div>

            </DashboardLayout>
        );
    }

    return (

        <DashboardLayout>

            <div className="container py-4">

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <div>

                        <h2>
                            My Bookings
                        </h2>

                        <p className="text-muted mb-0">
                            Manage your property viewing requests.
                        </p>

                    </div>

                </div>

                {bookings.length === 0 ? (

                    <div className="card shadow-sm">

                        <div className="card-body text-center py-5">

                            <h5>
                                No bookings yet
                            </h5>

                            <p className="text-muted">
                                When you request a property viewing,
                                it will appear here.
                            </p>

                        </div>

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

                                        <div className="d-flex justify-content-between align-items-start mb-3">

                                            <div>

                                                <h5 className="mb-1">
                                                    {booking.property_title}
                                                </h5>

                                                <small className="text-muted">
                                                    Viewing Request
                                                </small>

                                            </div>

                                            <span
                                                className={`badge ${getStatusClass(
                                                    booking.status
                                                )}`}
                                            >
                                                {booking.status}
                                            </span>

                                        </div>

                                        <hr />

                                        <div className="mb-2">

                                            <strong>
                                                Date:
                                            </strong>{" "}

                                            {booking.viewing_date}

                                        </div>

                                        <div className="mb-2">

                                            <strong>
                                                Time:
                                            </strong>{" "}

                                            {booking.viewing_time}

                                        </div>

                                        <div className="mb-2">

                                            <strong>
                                                Meeting:
                                            </strong>{" "}

                                            {booking.meeting_type ===
                                            "VIRTUAL"
                                                ? "Virtual Tour"
                                                : "Physical Viewing"}

                                        </div>

                                        {booking.owner_name && (

                                            <div className="mb-2">

                                                <strong>
                                                    Owner:
                                                </strong>{" "}

                                                {booking.owner_name}

                                            </div>

                                        )}

                                        {booking.message && (

                                            <div className="mt-3">

                                                <strong>
                                                    Your message:
                                                </strong>

                                                <p className="text-muted mb-0">
                                                    {booking.message}
                                                </p>

                                            </div>

                                        )}

                                        {booking.owner_notes && (

                                            <div className="alert alert-info mt-3 mb-0">

                                                <strong>
                                                    Owner notes:
                                                </strong>

                                                <div>
                                                    {booking.owner_notes}
                                                </div>

                                            </div>

                                        )}

                                        {booking.cancellation_reason && (

                                            <div className="alert alert-warning mt-3 mb-0">

                                                <strong>
                                                    Cancellation reason:
                                                </strong>

                                                <div>
                                                    {booking.cancellation_reason}
                                                </div>

                                            </div>

                                        )}

                                        <div className="mt-4">

                                            {booking.status ===
                                                "PENDING" && (

                                                <button
                                                    className="btn btn-outline-danger"
                                                    onClick={() =>
                                                        handleCancel(
                                                            booking
                                                        )
                                                    }
                                                >
                                                    Cancel Request
                                                </button>

                                            )}

                                            {booking.status ===
                                                "ACCEPTED" && (

                                                <div className="alert alert-success mb-0">

                                                    <strong>
                                                        Viewing confirmed.
                                                    </strong>

                                                    <br />

                                                    Please attend the viewing at the scheduled time.

                                                    {getLeaseForBooking(booking) ? (
                                                        <div className="d-flex flex-wrap gap-2 mt-3">
                                                            <Link
                                                                to={`/rentals/${getLeaseForBooking(booking).id}`}
                                                                className="btn btn-primary btn-sm"
                                                            >
                                                                View &amp; Sign Lease
                                                            </Link>
                                                            <Link
                                                                to={`/rentals/${getLeaseForBooking(booking).id}/pay`}
                                                                className="btn btn-outline-primary btn-sm"
                                                            >
                                                                Rent Payment
                                                            </Link>
                                                        </div>
                                                    ) : (
                                                        <div className="mt-2">
                                                            Your landlord will send the lease here after the viewing.
                                                            You can also check <Link to="/tenant/my-rentals">My Lease</Link>.
                                                        </div>
                                                    )}

                                                </div>

                                            )}

                                            {booking.status === "COMPLETED" && (

                                                <div className="alert alert-primary mb-0">

                                                    <strong>
                                                        Viewing completed.
                                                    </strong>

                                                    <div className="mt-2">
                                                        Choose this property to create your lease for signing.
                                                    </div>

                                                    {getLeaseForBooking(booking) ? (
                                                        <Link
                                                            to={`/rentals/${getLeaseForBooking(booking).id}`}
                                                            className="btn btn-primary btn-sm mt-3"
                                                        >
                                                            Review &amp; Sign Lease
                                                        </Link>
                                                    ) : (
                                                        <button
                                                            className="btn btn-primary btn-sm mt-3"
                                                            onClick={() => requestLease(booking)}
                                                        >
                                                            Rent This Property
                                                        </button>
                                                    )}

                                                </div>

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

export default MyBookings;