import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/services";

const getAuthConfig = () => {
    const token = localStorage.getItem("access_token");

    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};


export const getServiceCategories = async () => {

    const response = await axios.get(
        `${API_URL}/categories/`
    );

    return response.data;
};


export const getServiceListings = async (params = {}) => {

    const response = await axios.get(
        `${API_URL}/listings/`,
        {
            params,
        }
    );

    return response.data;
};


export const getServiceListing = async (id) => {

    const response = await axios.get(
        `${API_URL}/listings/${id}/`
    );

    return response.data;
};


export const getServiceProviders = async (params = {}) => {

    const response = await axios.get(
        `${API_URL}/providers/`,
        {
            params,
        }
    );

    return response.data;
};


export const getProviderListings = async (providerId) => {

    const response = await axios.get(
        `${API_URL}/providers/${providerId}/listings/`
    );

    return response.data;
};


export const createServiceRequest = async (data) => {

    const response = await axios.post(
        `${API_URL}/requests/`,
        data,
        getAuthConfig()
    );

    return response.data;
};


export const getMyServiceRequests = async () => {

    const response = await axios.get(
        `${API_URL}/requests/`,
        getAuthConfig()
    );

    return response.data;
};

export const cancelServiceRequest = async (id) => {

    const response = await axios.post(
        `${API_URL}/requests/${id}/cancel/`,
        {},
        getAuthConfig()
    );

    return response.data;
};

export const getProviderRequests = async () => {
    const response = await axios.get(
        `${API_URL}/provider/requests/`,
        getAuthConfig()
    );

    return response.data;
};

export const acceptServiceRequest = async (id) => {
    const response = await axios.post(
        `${API_URL}/provider/requests/${id}/accept/`,
        {},
        getAuthConfig()
    );

    return response.data;
};

export const rejectServiceRequest = async (id) => {
    const response = await axios.post(
        `${API_URL}/provider/requests/${id}/reject/`,
        {},
        getAuthConfig()
    );

    return response.data;
};

export const startServiceRequest = async (id) => {
    const response = await axios.post(
        `${API_URL}/provider/requests/${id}/start/`,
        {},
        getAuthConfig()
    );

    return response.data;
};

export const completeServiceRequest = async (id) => {
    const response = await axios.post(
        `${API_URL}/provider/requests/${id}/complete/`,
        {},
        getAuthConfig()
    );

    return response.data;
};

export const getServiceProvider = async (id) => {
    const response = await axios.get(
        `${API_URL}/providers/${id}/`
    );

    return response.data;
};

export const getProviderReviews = async (providerId) => {
    const response = await axios.get(
        `http://127.0.0.1:8000/api/reviews/service-reviews/?provider=${providerId}`
    );

    return response.data;
};

export const createServiceReview = async (data) => {
    const response = await axios.post(
        "http://127.0.0.1:8000/api/reviews/service-reviews/",
        data,
        getAuthConfig()
    );

    return response.data;
};


export const getMyServiceReviews = async () => {
    const response = await axios.get(
        "http://127.0.0.1:8000/api/reviews/service-reviews/",
        getAuthConfig()
    );

    return response.data;
};