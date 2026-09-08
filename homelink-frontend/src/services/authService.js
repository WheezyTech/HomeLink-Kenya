import api from "../api/axios";


const register = async (userData) => {
    let config = {};

    // If FormData, let axios set multipart headers
    if (userData instanceof FormData) {
        config = { headers: { "Content-Type": "multipart/form-data" } };
    }

    const response = await api.post(
        "auth/register/",
        userData,
        config
    );

    return response.data;
};



const login = async (credentials) => {

    const response = await api.post(
        "auth/login/",
        credentials
    );

    const { tokens, user } = response.data.data;

    localStorage.setItem(
        "access",
        tokens.access
    );

    localStorage.setItem(
        "refresh",
        tokens.refresh
    );

    localStorage.setItem(
        "user",
        JSON.stringify(user)
    );

    return response.data;
};



const logout = () => {

    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");

};



const authService = {

    register,
    login,
    logout,

};


export default authService;