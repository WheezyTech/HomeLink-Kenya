const configuredApiBaseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/";

export const API_BASE_URL = configuredApiBaseUrl.replace(/\/+$/, "");

const apiOrigin = new URL(API_BASE_URL).origin;

export const NOTIFICATIONS_SOCKET_URL =
    `${apiOrigin.replace(/^https:/, "wss:").replace(/^http:/, "ws:")}/ws/notifications/`;
