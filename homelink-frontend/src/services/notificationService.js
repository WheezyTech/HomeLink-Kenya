import api from "../api/axios";

const getNotifications = async () => {
    const response = await api.get("notifications/");
    return response.data;
};

const markRead = async (id) => {
    const response = await api.post(
        `notifications/${id}/mark_read/`
    );
    return response.data;
};

const markAllRead = async () => {
    const response = await api.post(
        "notifications/mark_all_read/"
    );
    return response.data;
};

const getUnreadCount = async () => {
    const response = await api.get(
        "notifications/unread_count/"
    );

    return response.data;
};

export default {
    getNotifications,
    markRead,
    markAllRead,
    getUnreadCount,
};