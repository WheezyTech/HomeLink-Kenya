import { useState } from "react";
import toast from "react-hot-toast";

import bookingService from "../../services/bookingService";

function RequestViewing({ propertyId, onSuccess }) {

    const [formData, setFormData] = useState({
        viewing_date: "",
        viewing_time: "",
        meeting_type: "PHYSICAL",
        message: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!propertyId) {
            toast.error("Property not found.");
            return;
        }

        setLoading(true);

        try {

            await bookingService.createBooking({
                property: propertyId,
                viewing_date: formData.viewing_date,
                viewing_time: formData.viewing_time,
                meeting_type: formData.meeting_type,
                message: formData.message,
            });

            toast.success(
                "Viewing request sent successfully."
            );

            setFormData({
                viewing_date: "",
                viewing_time: "",
                meeting_type: "PHYSICAL",
                message: "",
            });

            if (onSuccess) {
                onSuccess();
            }

        } catch (error) {

            console.error(error);

            const message =
                error.response?.data?.message ||
                error.response?.data?.detail ||
                "Failed to send viewing request.";

            toast.error(message);

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className="card shadow-sm mt-4">

            <div className="card-body">

                <h4 className="mb-3">
                    Request a Viewing
                </h4>

                <p className="text-muted">
                    Choose a convenient date and time to view
                    this property.
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="row">

                        <div className="col-md-6 mb-3">

                            <label className="form-label">
                                Viewing Date
                            </label>

                            <input
                                type="date"
                                name="viewing_date"
                                className="form-control"
                                value={formData.viewing_date}
                                onChange={handleChange}
                                min={
                                    new Date()
                                        .toISOString()
                                        .split("T")[0]
                                }
                                required
                            />

                        </div>

                        <div className="col-md-6 mb-3">

                            <label className="form-label">
                                Viewing Time
                            </label>

                            <input
                                type="time"
                                name="viewing_time"
                                className="form-control"
                                value={formData.viewing_time}
                                onChange={handleChange}
                                required
                            />

                        </div>

                    </div>

                    <div className="mb-3">

                        <label className="form-label">
                            Viewing Type
                        </label>

                        <select
                            name="meeting_type"
                            className="form-select"
                            value={formData.meeting_type}
                            onChange={handleChange}
                        >

                            <option value="PHYSICAL">
                                Physical Viewing
                            </option>

                            <option value="VIRTUAL">
                                Virtual Tour
                            </option>

                        </select>

                    </div>

                    <div className="mb-3">

                        <label className="form-label">
                            Message to Owner
                        </label>

                        <textarea
                            name="message"
                            className="form-control"
                            rows="4"
                            placeholder="Tell the owner anything they should know..."
                            value={formData.message}
                            onChange={handleChange}
                        />

                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={loading}
                    >

                        {loading
                            ? "Sending Request..."
                            : "Request Viewing"}

                    </button>

                </form>

            </div>

        </div>
    );
}

export default RequestViewing;