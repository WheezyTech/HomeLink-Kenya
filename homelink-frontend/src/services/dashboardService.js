import api from "../api/axios";

const getDashboard = async () => {
    const response = await api.get("dashboard/");
    return response.data.data;
};

export default {
    getDashboard,
};