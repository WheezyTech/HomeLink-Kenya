import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import DashboardLayout from "../../layouts/DashboardLayout";
import bookingService from "../../services/bookingService";

function Bookings() {

    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {

        try {

            const data = await bookingService.getBookings();

            setBookings(data);

        } catch {

            toast.error("Failed to load bookings");

        }

    };

    const cancelBooking = async (id) => {

        if (!window.confirm("Cancel this booking?"))
            return;

        try {

            await bookingService.cancelBooking(id);

            toast.success("Booking cancelled");

            loadBookings();

        } catch {

            toast.error("Unable to cancel booking");

        }

    };

    const badge = (status) => {

        switch(status){

            case "PENDING":

                return "bg-warning";

            case "ACCEPTED":

                return "bg-success";

            case "REJECTED":

                return "bg-danger";

            case "CANCELLED":

                return "bg-secondary";

            default:

                return "bg-primary";

        }

    };

    return (

        <DashboardLayout>

            <div className="container py-4">

                <h2 className="mb-4 fw-bold">

                    My Bookings

                </h2>

                <div className="card shadow">

                    <div className="table-responsive">

                        <table className="table table-hover align-middle">

                            <thead className="table-light">

                                <tr>

                                    <th>Property</th>

                                    <th>Date</th>

                                    <th>Time</th>

                                    <th>Status</th>

                                    <th>Message</th>

                                    <th>Action</th>

                                </tr>

                            </thead>

                            <tbody>

                                {bookings.length===0 && (

                                    <tr>

                                        <td colSpan="6" className="text-center py-5">

                                            No bookings found.

                                        </td>

                                    </tr>

                                )}

                                {bookings.map((booking)=>(

                                    <tr key={booking.id}>

                                        <td>{booking.property_title}</td>

                                        <td>{booking.viewing_date}</td>

                                        <td>{booking.viewing_time}</td>

                                        <td>

                                            <span className={`badge ${badge(booking.status)}`}>

                                                {booking.status}

                                            </span>

                                        </td>

                                        <td>{booking.message}</td>

                                        <td>

                                            {booking.status==="PENDING" && (

                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={()=>cancelBooking(booking.id)}
                                                >

                                                    Cancel

                                                </button>

                                            )}

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </DashboardLayout>

    );

}

export default Bookings;