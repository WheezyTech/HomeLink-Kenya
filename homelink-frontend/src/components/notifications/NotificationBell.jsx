import { useEffect, useState } from "react";
import { FaBell, FaHome } from "react-icons/fa";
import api from "../../api/axios";
import "../../styles/notification-bell.css";

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
        <div className="notification-bell">

            <button
                onClick={() =>
                    setOpen(!open)
                }
                className="notification-bell__trigger"
                aria-label={alerts.length > 0 ? `${alerts.length} unread notifications` : "Notifications"}
                aria-expanded={open}
                title={
                    connected
                        ? "Notifications connected"
                        : "Notifications offline"
                }
            >

                <FaBell aria-hidden="true" />

                {alerts.length > 0 && (
                    <span className="notification-bell__badge">
                        {alerts.length > 99
                            ? "99+"
                            : alerts.length}
                    </span>
                )}

            </button>


            {open && (

                <div className="notification-bell__panel">

                    <div className="notification-bell__header">

                        <div>

                            <h3>
                                Notifications
                            </h3>

                            <p className={`notification-bell__status ${connected ? "is-live" : "is-offline"}`}>
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
                                className="notification-bell__action"
                            >
                                Mark all read
                            </button>

                        )}

                    </div>


                    <div className="notification-bell__list">

                        {alerts.length === 0 ? (

                            <div className="notification-bell__empty">

                                <div className="notification-bell__empty-icon">
                                    <FaBell aria-hidden="true" />
                                </div>

                                <p className="notification-bell__empty-title">
                                    You're all caught up
                                </p>

                                <p className="notification-bell__empty-copy">
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
                                        className="notification-bell__item"
                                    >

                                        <div className="notification-bell__item-content">

                                            <div className="notification-bell__item-icon">
                                                <FaHome aria-hidden="true" />
                                            </div>

                                            <div className="notification-bell__item-copy">

                                                <h4>
                                                    {
                                                        alert.title
                                                    }
                                                </h4>

                                                <p>
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
                                                    className="notification-bell__action"
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