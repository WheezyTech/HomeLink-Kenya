import api from "../api/axios";

const getFavourites = async () => {
    const response = await api.get("favourites/");
    return response.data;
};

const toggleFavourite = async (propertyId) => {
    const response = await api.post(
        "favourites/toggle/",
        {
            property: propertyId,
        }
    );

    return response.data;
};

const removeFavourite = async (id) => {
    const response = await api.delete(
        `favourites/${id}/`
    );

    return response.data;
};

export default {
    getFavourites,
    toggleFavourite,
    removeFavourite,
};