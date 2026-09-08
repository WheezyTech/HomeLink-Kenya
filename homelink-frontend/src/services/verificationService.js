import axios from "../api/axios";

const getVerification = () => {
    return axios.get("/auth/verification/");
};

const uploadVerification = (formData) => {
    return axios.post(
        "/auth/verification/",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
};

export default {
    getVerification,
    uploadVerification,
};