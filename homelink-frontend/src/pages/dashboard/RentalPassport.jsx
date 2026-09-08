import { useEffect, useState } from "react";
import { FaCheckCircle, FaFileAlt, FaHome, FaMoneyBillWave } from "react-icons/fa";

import DashboardLayout from "../../layouts/DashboardLayout";
import rentalPassportService from "../../services/rentalPassportService";

function RentalPassport() {
    const [passport, setPassport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadPassport = async () => {
            try {
                const response = await rentalPassportService.getRentalPassport();
                setPassport(response.data);
            } catch (requestError) {
                setError(
                    requestError.response?.data?.message ||
                    "Unable to load your rental passport."
                );
            } finally {
                setLoading(false);
            }
        };

        loadPassport();
    }, []);

    if (loading) {
        return <DashboardLayout><div className="container py-4">Loading rental passport...</div></DashboardLayout>;
    }

    if (error) {
        return <DashboardLayout><div className="container py-4"><div className="alert alert-danger">{error}</div></div></DashboardLayout>;
    }

    const applicationStatuses = passport.applications.by_status;
    const paymentStatuses = passport.payments.by_status;

    return (
        <DashboardLayout>
            <div className="container py-4">
                <div className="d-flex justify-content-between align-items-start mb-4">
                    <div>
                        <h1 className="h3 mb-1">Rental Passport</h1>
                        <p className="text-muted mb-0">A private summary of your verified rental history.</p>
                    </div>
                    <FaFileAlt className="text-primary fs-2" />
                </div>

                <div className="row g-3 mb-4">
                    <div className="col-md-6 col-xl-3">
                        <div className="card border-0 shadow-sm h-100"><div className="card-body">
                            <FaCheckCircle className="text-success mb-2" />
                            <h6>Verification</h6>
                            <strong>{passport.profile.account_verified ? "Verified" : "In progress"}</strong>
                            <p className="small text-muted mb-0">Email and phone: {passport.profile.email_verified && passport.profile.phone_verified ? "verified" : "incomplete"}</p>
                        </div></div>
                    </div>
                    <div className="col-md-6 col-xl-3">
                        <div className="card border-0 shadow-sm h-100"><div className="card-body">
                            <FaFileAlt className="text-primary mb-2" />
                            <h6>Applications</h6>
                            <strong>{passport.applications.total}</strong>
                            <p className="small text-muted mb-0">{applicationStatuses.APPROVED || 0} approved</p>
                        </div></div>
                    </div>
                    <div className="col-md-6 col-xl-3">
                        <div className="card border-0 shadow-sm h-100"><div className="card-body">
                            <FaHome className="text-warning mb-2" />
                            <h6>Leases</h6>
                            <strong>{passport.leases.length}</strong>
                            <p className="small text-muted mb-0">{passport.leases.filter((lease) => lease.status === "ACTIVE").length} active</p>
                        </div></div>
                    </div>
                    <div className="col-md-6 col-xl-3">
                        <div className="card border-0 shadow-sm h-100"><div className="card-body">
                            <FaMoneyBillWave className="text-success mb-2" />
                            <h6>Payments</h6>
                            <strong>KSh {Number(passport.payments.total_paid).toLocaleString()}</strong>
                            <p className="small text-muted mb-0">{paymentStatuses.PAID || 0} paid records</p>
                        </div></div>
                    </div>
                </div>

                <div className="card border-0 shadow-sm">
                    <div className="card-body">
                        <h5 className="mb-3">Lease history</h5>
                        {passport.leases.length === 0 ? (
                            <p className="text-muted mb-0">No leases have been recorded yet.</p>
                        ) : (
                            <div className="table-responsive">
                                <table className="table align-middle mb-0">
                                    <thead><tr><th>Property</th><th>Status</th><th>Dates</th><th>Monthly rent</th></tr></thead>
                                    <tbody>
                                        {passport.leases.map((lease) => (
                                            <tr key={lease.id}>
                                                <td>{lease.property_title}</td>
                                                <td><span className="badge bg-light text-dark">{lease.status}</span></td>
                                                <td>{lease.start_date} to {lease.end_date}</td>
                                                <td>KSh {Number(lease.monthly_rent).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default RentalPassport;
