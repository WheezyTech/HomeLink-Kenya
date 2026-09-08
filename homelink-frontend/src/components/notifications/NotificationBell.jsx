import { useEffect, useState } from "react";
import api from "../../api/axios";

const WS_URL = "ws://127.0.0.1:8000/ws/notifications/";

export default function NotificationBell() {
    const [alerts, setAlerts] = useState([]);
    const [open, setOpen] = useState(false);
    const [connected, setConnected] = useState(false);

    const token = localStorage.getItem("access");

    async function loadAlerts() {
        if (!token) return;

        try {
            const response = await api.get(
                "alerts/alerts/unread/"
            );

            setAlerts(response.data);

        } catch (error) {
            console.error(
                "Failed to load alerts:",
                error
            );
        }
    }

    useEffect(() => {
        if (!token) return;

        // Load existing unread alerts
        loadAlerts();

        // Connect WebSocket
        const socket = new WebSocket(
            `${WS_URL}?token=${encodeURIComponent(token)}`
        );

        socket.onopen = () => {
            console.log(
                "Notification WebSocket connected"
            );

            setConnected(true);
        };

        socket.onmessage = (event) => {

            try {
                const data = JSON.parse(
                    event.data
                );

                console.log(
                    "Notification received:",
                    data
                );

                if (
                    data.type ===
                    "property_alert"
                ) {

                    setAlerts((current) => {

                        const exists =
                            current.some(
                                (alert) =>
                                    alert.id ===
                                    data.id
                            );

                        if (exists) {
                            return current;
                        }

                        return [
                            {
                                id: data.id,
                                title: data.title,
                                message:
                                    data.message,
                                property:
                                    data.property_id,
                                alert_type:
                                    data.alert_type,
                                is_read: false,
                            },
                            ...current,
                        ];
                    });
                }

            } catch (error) {
                console.error(
                    "Invalid WebSocket message:",
                    error
                );
            }
        };

        socket.onerror = (error) => {
            console.error(
                "Notification WebSocket error:",
                error
            );

            setConnected(false);
        };

        socket.onclose = () => {
            console.log(
                "Notification WebSocket disconnected"
            );

            setConnected(false);
        };

        return () => {
            socket.close();
        };

    }, [token]);


    async function markRead(id) {

        try {

            await api.post(
                `alerts/alerts/${id}/mark_read/`
            );

            setAlerts((current) =>
                current.filter(
                    (alert) =>
                        alert.id !== id
                )
            );

        } catch (error) {

            console.error(
                "Failed to mark alert:",
                error
            );

        }
    }


    async function markAllRead() {

        try {

            await api.post(
                "alerts/alerts/mark_all_read/"
            );

            setAlerts([]);

        } catch (error) {

            console.error(
                "Failed to mark alerts:",
                error
            );

        }
    }


    return (
        <div className="relative">

            <button
                onClick={() =>
                    setOpen(!open)
                }
                className="relative p-2 rounded-full hover:bg-gray-100"
                title={
                    connected
                        ? "Notifications connected"
                        : "Notifications offline"
                }
            >

                <span className="text-2xl">
                    🔔
                </span>

                {alerts.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center">
                        {alerts.length > 99
                            ? "99+"
                            : alerts.length}
                    </span>
                )}

            </button>


            {open && (

                <div className="absolute right-0 mt-3 w-[360px] max-w-[90vw] bg-white border rounded-xl shadow-xl z-50">

                    <div className="p-4 border-b flex justify-between items-center">

                        <div>

                            <h3 className="font-bold">
                                Notifications
                            </h3>

                            <p className="text-xs text-gray-500">
                                {connected
                                    ? "● Live"
                                    : "● Offline"}
                            </p>

                        </div>

                        {alerts.length > 0 && (

                            <button
                                onClick={
                                    markAllRead
                                }
                                className="text-sm text-blue-600"
                            >
                                Mark all read
                            </button>

                        )}

                    </div>


                    <div className="max-h-[420px] overflow-y-auto">

                        {alerts.length === 0 ? (

                            <div className="p-8 text-center">

                                <div className="text-3xl">
                                    🔔
                                </div>

                                <p className="font-medium mt-2">
                                    You're all caught up
                                </p>

                                <p className="text-sm text-gray-500 mt-1">
                                    New property matches
                                    will appear here.
                                </p>

                            </div>

                        ) : (

                            alerts.map(
                                (alert) => (

                                    <div
                                        key={
                                            alert.id
                                        }
                                        className="p-4 border-b hover:bg-gray-50"
                                    >

                                        <div className="flex gap-3">

                                            <div className="text-xl">
                                                🏠
                                            </div>

                                            <div className="flex-1">

                                                <h4 className="font-semibold text-sm">
                                                    {
                                                        alert.title
                                                    }
                                                </h4>

                                                <p className="text-sm text-gray-600 mt-1">
                                                    {
                                                        alert.message
                                                    }
                                                </p>

                                                <button
                                                    onClick={() =>
                                                        markRead(
                                                            alert.id
                                                        )
                                                    }
                                                    className="text-xs text-blue-600 mt-2"
                                                >
                                                    Mark as read
                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                )
                            )

                        )}

                    </div>

                </div>

            )}

        </div>
    );
}