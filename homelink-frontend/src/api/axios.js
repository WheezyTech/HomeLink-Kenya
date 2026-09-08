import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api/",
    headers: {
        "Content-Type": "application/json",
    },
});


// Attach access token to every request
api.interceptors.request.use(
    (config) => {

        const token =
            localStorage.getItem("access");

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;

        }

        return config;

    },
    (error) => {

        return Promise.reject(error);

    }
);


// Handle expired/invalid token
api.interceptors.response.use(

    (response) => response,

    (error) => {

        if (error.response?.status === 401) {

            console.log(
                "Authentication expired or invalid."
            );

            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            localStorage.removeItem("user");

            // Don't force redirect while already on login
            if (
                window.location.pathname !== "/login"
            ) {

                window.location.href = "/login";

            }

        }

        return Promise.reject(error);

    }

);


export default api;