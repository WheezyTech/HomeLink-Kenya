import api from "../api/axios";

const getRentalPassport = async () => {
    const response = await api.get("auth/rental-passport/");
    return response.data;
};

export default {
    getRentalPassport,
};
