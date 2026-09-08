import api from "../api/axios";

const getProfile = async () => {

    const response = await api.get(
        "auth/profile/"
    );

    return response.data;

};

const updateProfile = async (data) => {

    const response = await api.patch(
        "auth/profile/",
        data
        , data instanceof FormData
            ? { headers: { "Content-Type": "multipart/form-data" } }
            : undefined
    );

    return response.data;

};

const getAgents = async () => {
    const response = await api.get("auth/agents/");
    return response.data;
};

const getAgent = async (id) => {
    const response = await api.get(`auth/agents/${id}/`);
    return response.data;
};

const changePassword = async (data) => {

    const response = await api.post(
        "auth/change-password/",
        data
    );

    return response.data;

};

export default {
    getProfile,
    updateProfile,
    changePassword,
    getAgents,
    getAgent,
};