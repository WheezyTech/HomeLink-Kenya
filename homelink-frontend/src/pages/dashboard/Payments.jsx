import { useEffect, useState } from "react";
import {
    FaMoneyBillWave,
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
    FaReceipt,
} from "react-icons/fa";

import DashboardLayout from "../../layouts/DashboardLayout";
import paymentService from "../../services/paymentService";

function Payments() {

    const [payments, setPayments] = useState([]);

    useEffect(() => {
        loadPayments();
    }, []);

    const loadPayments = async () => {

        try {

            const response = await paymentService.getPayments();

            setPayments(response);

        } catch (error) {

            console.error(error);

        }

    };

    const statusBadge = (status) => {

        switch (status) {

            case "SUCCESS":
                return "bg-success";

            case "PENDING":
                return "bg-warning text-dark";

            case "FAILED":
                return "bg-danger";

            default:
                return "bg-secondary";
        }

    };

    const totalPaid = payments
        .filter((p) => p.status === "SUCCESS")
        .reduce((sum, p) => sum + Number(p.amount), 0);

    return (

        <DashboardLayout>

            <div className="container-fluid">

                <h2 className="fw-bold mb-4">

                    Payments

                </h2>

                {/* Statistics */}

                <div className="row g-4 mb-4">

                    <div className="col-md-3">

                        <div className="card shadow border-0">

                            <div className="card-body">

                                <FaMoneyBillWave
                                    size={35}
                                    className="text-primary mb-2"
                                />

                                <h6>Total Paid</h6>

                                <h3>

                                    KES {totalPaid.toLocaleString()}

                                </h3>

                            </div>

                        </div>

                    </div>

                    <div className="col-md-3">

                        <div className="card shadow border-0">

                            <div className="card-body">

                                <FaCheckCircle
                                    size={35}
                                    className="text-success mb-2"
                                />

                                <h6>Successful</h6>

                                <h3>

                                    {
                                        payments.filter(
                                            p => p.status === "SUCCESS"
                                        ).length
                                    }

                                </h3>

                            </div>

                        </div>

                    </div>

                    <div className="col-md-3">

                        <div className="card shadow border-0">

                            <div className="card-body">

                                <FaClock
                                    size={35}
                                    className="text-warning mb-2"
                                />

                                <h6>Pending</h6>

                                <h3>

                                    {
                                        payments.filter(
                                            p => p.status === "PENDING"
                                        ).length
                                    }

                                </h3>

                            </div>

                        </div>

                    </div>

                    <div className="col-md-3">

                        <div className="card shadow border-0">

                            <div className="card-body">

                                <FaTimesCircle
                                    size={35}
                                    className="text-danger mb-2"
                                />

                                <h6>Failed</h6>

                                <h3>

                                    {
                                        payments.filter(
                                            p => p.status === "FAILED"
                                        ).length
                                    }

                                </h3>

                            </div>

                        </div>

                    </div>

                </div>

                {/* Payment Table */}

                <div className="card shadow">

                    <div className="card-header">

                        <h5 className="mb-0">

                            Payment History

                        </h5>

                    </div>

                    <div className="table-responsive">

                        <table className="table table-hover align-middle mb-0">

                            <thead className="table-light">

                                <tr>

                                    <th>Plan</th>

                                    <th>Phone</th>

                                    <th>Amount</th>

                                    <th>Status</th>

                                    <th>Receipt</th>

                                    <th>Date</th>

                                </tr>

                            </thead>

                            <tbody>

                                {payments.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="6"
                                            className="text-center py-5"
                                        >

                                            No payments found.

                                        </td>

                                    </tr>

                                ) : (

                                    payments.map((payment) => (

                                        <tr key={payment.id}>

                                            <td>

                                                {payment.plan_name}

                                            </td>

                                            <td>

                                                {payment.phone_number}

                                            </td>

                                            <td>

                                                KES {payment.amount}

                                            </td>

                                            <td>

                                                <span
                                                    className={`badge ${statusBadge(payment.status)}`}
                                                >

                                                    {payment.status}

                                                </span>

                                            </td>

                                            <td>

                                                {payment.mpesa_receipt_number || "-"}

                                            </td>

                                            <td>

                                                {payment.transaction_date || "-"}

                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </DashboardLayout>

    );

}

export default Payments;