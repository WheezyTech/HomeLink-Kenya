import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import profileService from "../../services/profileService";

function Agents() {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAgents = async () => {
            try {
                setLoading(true);
                const data = await profileService.getAgents();
                setAgents(Array.isArray(data) ? data : data?.results || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadAgents();
    }, []);

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Our Verified Agents</h2>
                    <p className="text-muted mb-0">Browse trusted real estate professionals ready to help.</p>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <p className="text-muted">Loading agents...</p>
                </div>
            ) : agents.length === 0 ? (
                <div className="text-center py-5">
                    <h3>No agents available right now.</h3>
                </div>
            ) : (
                <div className="row g-4">
                    {agents.map((agent) => {
                        const fullName = [agent.first_name, agent.last_name]
                            .filter(Boolean)
                            .join(" ") || "Agent";

                        return (
                            <div className="col-md-6 col-lg-4" key={agent.id}>
                                <div className="card h-100 border-0 shadow-sm rounded-4">
                                    <div className="card-body p-4">
                                        <div className="d-flex align-items-center gap-3 mb-3">
                                            <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>
                                                {fullName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h5 className="fw-bold mb-1">{fullName}</h5>
                                                <p className="text-muted mb-0">Verified Agent</p>
                                            </div>
                                        </div>

                                        <p className="text-muted mb-3">
                                            {agent.bio || "Ready to help you find a great property."}
                                        </p>

                                        <div className="small text-muted mb-3">
                                            <div>Phone: {agent.phone || "Not provided"}</div>
                                            <div>Email: {agent.email || "Not provided"}</div>
                                        </div>

                                        <Link to={`/agents/${agent.id}`} className="btn btn-outline-primary rounded-pill">
                                            View profile
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Agents;
