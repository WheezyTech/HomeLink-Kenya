import api from "../api/axios";

const getAnalytics = async () => {

    const response = await api.get("dashboard/");

    return response.data;

};

export default {

    getAnalytics,

};