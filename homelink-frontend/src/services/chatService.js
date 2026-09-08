import api from "../api/axios";

const getConversations = async () => {
    const response = await api.get("chat/");
    return response.data;
};

const startConversation = async (propertyId) => {
    const response = await api.post("chat/start/", {
        property: propertyId,
    });
    return response.data;
};

const getMessages = async (conversationId) => {
    const response = await api.get(
        `chat/${conversationId}/messages/`
    );
    return response.data;
};

const sendMessage = async (
    conversationId,
    data
) => {
    const response = await api.post(
        `chat/${conversationId}/send/`,
        data
    );

    return response.data;
};

export default {

    getConversations,

    startConversation,

    getMessages,

    sendMessage,

};