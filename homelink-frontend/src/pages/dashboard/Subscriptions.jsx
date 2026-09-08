import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import subscriptionService from "../../services/subscriptionService";
import { useNavigate } from "react-router-dom";

function Subscriptions() {

    const [plans, setPlans] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadPlans();
    }, []);

    const loadPlans = async () => {
        try {
            const data = await subscriptionService.getPlans();
            setPlans(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (

        <DashboardLayout>

            <h2 className="mb-4">
                Subscription Plans
            </h2>

            <div className="row">

                {plans.map(plan => (

                    <div
                        key={plan.id}
                        className="col-md-4 mb-4"
                    >

                        <div className="card shadow border-0 h-100">

                            <div className="card-body text-center">

                                <h3>{plan.name}</h3>

                                <h1 className="text-primary">

                                    KSh {plan.price}

                                </h1>

                                <p>

                                    {plan.duration_days} Days

                                </p>

                                <hr/>

                                <p>

                                    <strong>

                                        Max Properties

                                    </strong>

                                    <br/>

                                    {plan.max_properties}

                                </p>

                                <button
                                    className="btn btn-primary w-100"
                                    onClick={() =>
                                        navigate(
                                            "/dashboard/payments",
                                            {
                                                state:{
                                                    plan
                                                }
                                            }
                                        )
                                    }
                                >

                                    Subscribe

                                </button>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </DashboardLayout>

    );

}

export default Subscriptions;