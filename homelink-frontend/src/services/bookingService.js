import api from "../api/axios";

const getBookings = async () => {

    const response = await api.get(
        "bookings/"
    );

    return response.data;
};

const getIncomingBookings = async () => {

    const response = await api.get(
        "bookings/incoming/"
    );

    return response.data;
};

const createBooking = async (data) => {

    const response = await api.post(
        "bookings/",
        data
    );

    return response.data;
};


const cancelBooking = async (id, reason = "") => {

    const response = await api.post(
        `bookings/${id}/cancel/`,
        {
            reason,
        }
    );

    return response.data;
};


const acceptBooking = async (
    id,
    owner_notes = ""
) => {

    const response = await api.post(
        `bookings/${id}/accept/`,
        {
            owner_notes,
        }
    );

    return response.data;
};


const rejectBooking = async (
    id,
    owner_notes = ""
) => {

    const response = await api.post(
        `bookings/${id}/reject/`,
        {
            owner_notes,
        }
    );

    return response.data;
};


const checkInBooking = async (id) => {

    const response = await api.post(
        `bookings/${id}/check_in/`
    );

    return response.data;
};


const completeBooking = async (id) => {

    const response = await api.post(
        `bookings/${id}/complete/`
    );

    return response.data;
};


const requestLease = async (id) => {

    const response = await api.post(
        `bookings/${id}/request_lease/`
    );

    return response.data;
};


export default {
    getBookings,
    getIncomingBookings,
    createBooking,
    cancelBooking,
    acceptBooking,
    rejectBooking,
    checkInBooking,
    completeBooking,
    requestLease,
};