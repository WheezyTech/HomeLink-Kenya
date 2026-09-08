import api from "../api/axios";

const getPlans = async () => {
    const response = await api.get("subscriptions/");
    return response.data;
};

export default {
    getPlans,
};