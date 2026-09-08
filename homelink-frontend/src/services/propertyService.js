import api from "../api/axios";

const getProperties = async () => {
    const response = await api.get("properties/");
    return response.data;
};

const getProperty = async (id) => {
    const response = await api.get(`properties/${id}/`);
    return response.data;
};

const createProperty = async (data) => {
    const response = await api.post("properties/", data);
    return response.data;
};

const updateProperty = async (id, data) => {
    const response = await api.put(`properties/${id}/`, data);
    return response.data;
};

const deleteProperty = async (id) => {
    const response = await api.delete(`properties/${id}/`);
    return response.data;
};

const getMyProperties = async () => {
    const response = await api.get("properties/my_properties/");
    return response.data;
};

const searchProperties = async (filters) => {
    const response = await api.get("properties/", {
        params: filters,
    });

    return response.data;
};

const getRentProperties = async (filters = {}) => {

    const response = await api.get("properties/", {
        params: {
            purpose: "RENT",
            ...filters,
        },
    });

    return response.data;
};

const getBuyProperties = async (filters = {}) => {

    const response = await api.get("properties/", {
        params: {
            purpose: "SALE",
            ...filters,
        },
    });

    return response.data;
};

const getFeaturedProperties = async () => {

    const response = await api.get("properties/", {
        params: {
            is_featured: true,
        },
    });

    return response.data;
};

const getFilteredProperties = async (filters) => {
    const response = await api.get("properties/", {
        params: filters,
    });

    return response.data;
};

const getAgents = async () => {

    const response =
        await api.get("agents/");

    return response.data;
};

/*
 * Upload ONE image.
 * The backend currently supports this endpoint.
 */
const uploadPropertyImage = async (propertyId, image) => {

    const formData = new FormData();

    formData.append("property", propertyId);
    formData.append("image", image);

    const response = await api.post(
        "properties/upload-image/",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};


/*
 * Upload multiple images one at a time.
 */
const uploadImages = async (propertyId, images) => {

    const uploadedImages = [];

    for (const image of images) {

        const result = await uploadPropertyImage(
            propertyId,
            image
        );

        uploadedImages.push(result);

    }

    return uploadedImages;
};


export default {
    getProperties,
    getProperty,
    createProperty,
    updateProperty,
    deleteProperty,
    getMyProperties,
    uploadPropertyImage,
    uploadImages,
    searchProperties,
    getFilteredProperties,
    getRentProperties,
    getBuyProperties,
    getFeaturedProperties,
    getAgents,
};