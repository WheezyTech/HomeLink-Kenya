import { useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../../layouts/DashboardLayout";
import { FaBell, FaLock, FaUserCog } from "react-icons/fa";
import profileService from "../../services/profileService";

function Settings() {

    const [settings, setSettings] = useState({
        email_notifications: true,
        chat_notifications: true,
        booking_notifications: true,
        payment_notifications: true,
    });

    const [passwords, setPasswords] = useState({
        current_password: "",
        new_password: "",
        confirm_password: "",
    });

    const [changingPassword, setChangingPassword] = useState(false);

    const handleChange = (e) => {

        setSettings({
            ...settings,
            [e.target.name]: e.target.checked,
        });

    };

    const handlePasswordChange = (e) => {

        setPasswords({
            ...passwords,
            [e.target.name]: e.target.value,
        });

    };

    const handleChangePassword = async (e) => {

        e.preventDefault();

        setChangingPassword(true);

        try {

            await profileService.changePassword(
                passwords
            );

            toast.success(
                "Password changed successfully."
            );

            setPasswords({
                current_password: "",
                new_password: "",
                confirm_password: "",
            });

        } catch (error) {

            console.error(error);

            const errors =
                error.response?.data?.data;

            if (errors?.current_password) {

                toast.error(
                    errors.current_password[0]
                );

            } else if (errors?.new_password) {

                toast.error(
                    errors.new_password[0]
                );

            } else if (errors?.confirm_password) {

                toast.error(
                    errors.confirm_password[0]
                );

            } else {

                toast.error(
                    "Unable to change password."
                );

            }

        } finally {

            setChangingPassword(false);

        }

    };

    const handleSave = (e) => {

        e.preventDefault();

        localStorage.setItem(
            "notification_settings",
            JSON.stringify(settings)
        );

        alert("Settings saved successfully.");

    };

    return (

        <DashboardLayout>

            <div className="container-fluid p-4">

                <div className="mb-4">

                    <h2 className="fw-bold">
                        Settings
                    </h2>

                    <p className="text-muted">
                        Manage your HomeLink Kenya account preferences.
                    </p>

                </div>

                <div className="row g-4">

                    {/* Notifications */}

                    <div className="col-lg-7">

                        <div className="card border-0 shadow-sm">

                            <div className="card-body p-4">

                                <div className="d-flex align-items-center mb-4">

                                    <FaBell
                                        className="text-primary me-3"
                                        size={22}
                                    />

                                    <div>

                                        <h5 className="mb-0">
                                            Notifications
                                        </h5>

                                        <small className="text-muted">
                                            Choose which notifications you receive.
                                        </small>

                                    </div>

                                </div>

                                <form onSubmit={handleSave}>

                                    <div className="form-check form-switch mb-4">

                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name="email_notifications"
                                            checked={
                                                settings.email_notifications
                                            }
                                            onChange={handleChange}
                                        />

                                        <label className="form-check-label">

                                            <strong>
                                                Email Notifications
                                            </strong>

                                            <br />

                                            <small className="text-muted">
                                                Receive important updates by email.
                                            </small>

                                        </label>

                                    </div>

                                    <div className="form-check form-switch mb-4">

                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name="chat_notifications"
                                            checked={
                                                settings.chat_notifications
                                            }
                                            onChange={handleChange}
                                        />

                                        <label className="form-check-label">

                                            <strong>
                                                Chat Notifications
                                            </strong>

                                            <br />

                                            <small className="text-muted">
                                                Get notified when someone sends you a message.
                                            </small>

                                        </label>

                                    </div>

                                    <div className="form-check form-switch mb-4">

                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name="booking_notifications"
                                            checked={
                                                settings.booking_notifications
                                            }
                                            onChange={handleChange}
                                        />

                                        <label className="form-check-label">

                                            <strong>
                                                Booking Notifications
                                            </strong>

                                            <br />

                                            <small className="text-muted">
                                                Receive updates about property bookings.
                                            </small>

                                        </label>

                                    </div>

                                    <div className="form-check form-switch mb-4">

                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name="payment_notifications"
                                            checked={
                                                settings.payment_notifications
                                            }
                                            onChange={handleChange}
                                        />

                                        <label className="form-check-label">

                                            <strong>
                                                Payment Notifications
                                            </strong>

                                            <br />

                                            <small className="text-muted">
                                                Receive payment and subscription updates.
                                            </small>

                                        </label>

                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                    >
                                        Save Settings
                                    </button>

                                </form>

                            </div>

                        </div>

                    </div>

                    {/* Account */}

                    <div className="col-lg-5">

                        <div className="card border-0 shadow-sm mb-4">

                            <div className="card-body p-4">

                                <div className="d-flex align-items-center mb-3">

                                    <FaUserCog
                                        className="text-primary me-3"
                                        size={22}
                                    />

                                    <h5 className="mb-0">
                                        Account
                                    </h5>

                                </div>

                                <p className="text-muted">
                                    Manage your personal account information
                                    from your profile.
                                </p>

                                <a
                                    href="/dashboard/profile"
                                    className="btn btn-outline-primary"
                                >
                                    Manage Profile
                                </a>

                            </div>

                        </div>

                        <div className="card border-0 shadow-sm">

                            <div className="card-body p-4">

                                <div className="d-flex align-items-center mb-3">

                                    <FaLock
                                        className="text-primary me-3"
                                        size={22}
                                    />

                                    <h5 className="mb-0">
                                        Security
                                    </h5>

                                </div>

                                <p className="text-muted">
                                    Keep your HomeLink Kenya account secure.
                                </p>

                                <button
                                    className="btn btn-outline-dark"
                                    data-bs-toggle="modal"
                                    data-bs-target="#changePasswordModal"
                                >
                                    Change Password
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            <div
                className="modal fade"
                id="changePasswordModal"
                tabIndex="-1"
            >
                <div className="modal-dialog">

                    <div className="modal-content">

                        <div className="modal-header">

                            <h5 className="modal-title">
                                Change Password
                            </h5>

                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                            />

                        </div>

                        <form onSubmit={handleChangePassword}>

                            <div className="modal-body">

                                <div className="mb-3">

                                    <label className="form-label">
                                        Current Password
                                    </label>

                                    <input
                                        type="password"
                                        name="current_password"
                                        className="form-control"
                                        value={
                                            passwords.current_password
                                        }
                                        onChange={handlePasswordChange}
                                        required
                                    />

                                </div>

                                <div className="mb-3">

                                    <label className="form-label">
                                        New Password
                                    </label>

                                    <input
                                        type="password"
                                        name="new_password"
                                        className="form-control"
                                        value={
                                            passwords.new_password
                                        }
                                        onChange={handlePasswordChange}
                                        required
                                    />

                                </div>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Confirm New Password
                                    </label>

                                    <input
                                        type="password"
                                        name="confirm_password"
                                        className="form-control"
                                        value={
                                            passwords.confirm_password
                                        }
                                        onChange={handlePasswordChange}
                                        required
                                    />

                                </div>

                            </div>

                            <div className="modal-footer">

                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={changingPassword}
                                >

                                    {changingPassword
                                        ? "Changing..."
                                        : "Change Password"
                                    }

                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            </div>

        </DashboardLayout>

    );

}

export default Settings;