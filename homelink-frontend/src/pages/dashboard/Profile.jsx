import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import profileService from "../../services/profileService";
import { useAuth } from "../../context/AuthContext";

function Profile() {

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [uploading, setUploading] = useState(false);
    const { setUser } = useAuth();

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await profileService.getProfile();

            console.log("PROFILE RESPONSE:", response);

            /*
             * Your API response:
             *
             * {
             *   success: true,
             *   message: "...",
             *   data: {
             *      user: {...}
             *   }
             * }
             */

            const user =
                response?.data?.user ||
                response?.user ||
                response?.data;

            if (!user) {
                throw new Error(
                    "User information was not found in API response."
                );
            }

            setProfile(user);

        } catch (error) {

            console.error(
                "PROFILE ERROR:",
                error
            );

            setError(
                "Unable to load profile."
            );

        } finally {

            setLoading(false);

        }

    };

    const handlePhotoChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Please select an image file.");
            return;
        }

        try {
            setUploading(true);
            setError("");
            const formData = new FormData();
            formData.append("profile_photo", file);
            const response = await profileService.updateProfile(formData);
            const updatedProfile = response.data || response;
            setProfile(updatedProfile);
            setUser((currentUser) => {
                const nextUser = { ...currentUser, ...updatedProfile };
                localStorage.setItem("user", JSON.stringify(nextUser));
                return nextUser;
            });
        } catch (uploadError) {
            setError(
                uploadError.response?.data?.message ||
                "Unable to upload profile picture."
            );
        } finally {
            setUploading(false);
            event.target.value = "";
        }
    };

    if (loading) {

        return (

            <DashboardLayout>

                <div className="text-center py-5">

                    <div
                        className="spinner-border text-primary"
                        role="status"
                    />

                    <p className="mt-3">
                        Loading profile...
                    </p>

                </div>

            </DashboardLayout>

        );

    }

    if (error) {

        return (

            <DashboardLayout>

                <div className="container-fluid p-4">

                    <div className="alert alert-danger">

                        {error}

                        <button
                            className="btn btn-sm btn-danger ms-3"
                            onClick={loadProfile}
                        >
                            Try Again
                        </button>

                    </div>

                </div>

            </DashboardLayout>

        );

    }

    return (

        <DashboardLayout>

            <div className="container-fluid p-4">

                <div className="mb-4">

                    <h2 className="fw-bold">
                        My Profile
                    </h2>

                    <p className="text-muted">
                        Manage your HomeLink Kenya account.
                    </p>

                </div>

                <div className="row g-4">

                    {/* Profile Card */}

                    <div className="col-lg-4">

                        <div className="card border-0 shadow-sm">

                            <div className="card-body text-center p-4">

                                {profile.profile_photo ? (
                                    <img
                                        src={profile.profile_photo}
                                        alt={`${profile.first_name} profile`}
                                        className="rounded-circle mx-auto mb-3"
                                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                    />
                                ) : (
                                    <div
                                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                                    style={{
                                        width: "100px",
                                        height: "100px",
                                        fontSize: "32px",
                                        fontWeight: "bold"
                                    }}
                                >

                                    {profile.first_name?.charAt(0)}
                                    {profile.last_name?.charAt(0)}

                                    </div>
                                )}

                                <label className="btn btn-outline-primary btn-sm mb-3">
                                    {uploading ? "Uploading..." : "Change profile picture"}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="d-none"
                                        onChange={handlePhotoChange}
                                        disabled={uploading}
                                    />
                                </label>

                                <h4 className="fw-bold">

                                    {profile.first_name}{" "}
                                    {profile.last_name}

                                </h4>

                                <p className="text-muted">

                                    @{profile.username}

                                </p>

                                <span className="badge bg-primary">

                                    {profile.role}

                                </span>

                                {profile.is_verified && (

                                    <div className="text-success mt-3">

                                        ✓ Verified Account

                                    </div>

                                )}

                            </div>

                        </div>

                    </div>


                    {/* Information */}

                    <div className="col-lg-8">

                        <div className="card border-0 shadow-sm">

                            <div className="card-body p-4">

                                <h5 className="fw-bold mb-4">

                                    Account Information

                                </h5>

                                <div className="row">

                                    <div className="col-md-6 mb-4">

                                        <label className="text-muted small">
                                            First Name
                                        </label>

                                        <div className="fw-semibold">
                                            {profile.first_name || "-"}
                                        </div>

                                    </div>

                                    <div className="col-md-6 mb-4">

                                        <label className="text-muted small">
                                            Last Name
                                        </label>

                                        <div className="fw-semibold">
                                            {profile.last_name || "-"}
                                        </div>

                                    </div>

                                    <div className="col-md-6 mb-4">

                                        <label className="text-muted small">
                                            Username
                                        </label>

                                        <div className="fw-semibold">
                                            {profile.username || "-"}
                                        </div>

                                    </div>

                                    <div className="col-md-6 mb-4">

                                        <label className="text-muted small">
                                            Email
                                        </label>

                                        <div className="fw-semibold">
                                            {profile.email || "-"}
                                        </div>

                                    </div>

                                    <div className="col-md-6 mb-4">

                                        <label className="text-muted small">
                                            Phone
                                        </label>

                                        <div className="fw-semibold">
                                            {profile.phone || "-"}
                                        </div>

                                    </div>

                                    <div className="col-md-6 mb-4">

                                        <label className="text-muted small">
                                            Account Status
                                        </label>

                                        <div>

                                            {profile.is_verified ? (

                                                <span className="badge bg-success">
                                                    Verified
                                                </span>

                                            ) : (

                                                <span className="badge bg-warning text-dark">
                                                    Not Verified
                                                </span>

                                            )}

                                        </div>

                                    </div>

                                </div>

                                <div className="mt-2">

                                    <button
                                        className="btn btn-primary"
                                        onClick={() =>
                                            window.location.href =
                                                "/dashboard/settings"
                                        }
                                    >
                                        Account Settings
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </DashboardLayout>

    );

}

export default Profile;