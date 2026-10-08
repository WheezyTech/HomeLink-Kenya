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

    const accessToken = tokens.access;
    const refreshToken = tokens.refresh;

    localStorage.setItem(
        "access",
        accessToken
    );

    localStorage.setItem(
        "access_token",
        accessToken
    );

    localStorage.setItem(
        "refresh",
        refreshToken
    );

    localStorage.setItem(
        "refresh_token",
        refreshToken
    );

    localStorage.setItem(
        "user",
        JSON.stringify(user)
    );

    return response.data;
};



const logout = () => {

    localStorage.removeItem("access");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

};



const authService = {

    register,
    login,
    logout,

};


export default authService;