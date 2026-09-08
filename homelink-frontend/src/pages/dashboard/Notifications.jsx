import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../../layouts/DashboardLayout";
import notificationService from "../../services/notificationService";

function Notifications() {

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            const data = await notificationService.getNotifications();
            setNotifications(data);
        } catch (error) {
            console.error(error);
        }
    };

    const markAll = async () => {
        try {
            await notificationService.markAllRead();
            toast.success("All notifications marked as read");

            setNotifications(
                notifications.map(n => ({
                    ...n,
                    is_read: true
                }))
            );

        } catch {
            toast.error("Failed");
        }
    };

    return (

        <DashboardLayout>

            <div className="container">

                <div className="d-flex justify-content-between mb-4">

                    <h2>Notifications</h2>

                    <button
                        className="btn btn-primary"
                        onClick={markAll}
                    >
                        Mark All Read
                    </button>

                </div>

                {
                    notifications.length === 0 ?

                    (

                        <div className="alert alert-info">

                            No notifications.

                        </div>

                    )

                    :

                    notifications.map(notification => (

                        <div
                            key={notification.id}
                            className={`card mb-3 shadow-sm ${
                                notification.is_read
                                    ? ""
                                    : "border-primary"
                            }`}
                            onClick={async () => {

                                if (!notification.is_read) {

                                    await notificationService.markRead(
                                        notification.id
                                    );

                                    setNotifications(prev =>
                                        prev.map(item =>
                                            item.id === notification.id
                                                ? {
                                                      ...item,
                                                      is_read: true,
                                                  }
                                                : item
                                        )
                                    );

                                }

                            }}
                        >

                            <div className="card-body">

                                <div className="d-flex justify-content-between">

                                    <div>

                                        <h5>

                                            {notification.title}

                                        </h5>

                                        <p>

                                            {notification.message}

                                        </p>

                                        <small className="text-muted">

                                            {notification.notification_type}

                                        </small>

                                    </div>

                                    <span className="badge bg-secondary">

                                        {
                                            new Date(
                                                notification.created_at
                                            ).toLocaleString()
                                        }

                                    </span>

                                </div>

                            </div>

                        </div>

                    ))

                }

            </div>

        </DashboardLayout>

    );

}

export default Notifications;