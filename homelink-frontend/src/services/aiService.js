import api from "../api/axios";

const askAssistant = async (message) => {
    const response = await api.post(
        "ai/assistant/",
        {
            message,
        }
    );

    return response.data;
};

const getRecommendations = async (filters = {}) => {
    const response = await api.get(
        "ai/recommendations/",
        {
            params: filters,
        }
    );

    return response.data;
};

const smartSearch = async (query) => {
    const response = await api.get(
        "ai/search/",
        {
            params: {
                q: query,
            },
        }
    );

    return response.data;
};

const smartAssistant = async (message) => {
    const response = await api.post(
        "ai/smart-assistant/",
        {
            message,
        }
    );

    return response.data;
};

export default {
    askAssistant,
    getRecommendations,
    smartSearch,
    smartAssistant,
};