import api from "../api/axios";

const createReport = async ({ property, reason, description }) => {
    const response = await api.post("reports/", {
        property,
        reason,
        description,
    });

    return response.data;
};

export default {
    createReport,
};
