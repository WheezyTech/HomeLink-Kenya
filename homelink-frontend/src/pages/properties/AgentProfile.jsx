import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import profileService from "../../services/profileService";

function AgentProfile() {
    const { id } = useParams();
    const [agent, setAgent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAgent = async () => {
            try {
                setLoading(true);
                const data = await profileService.getAgent(id);
                setAgent(data?.agent ?? data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadAgent();
    }, [id]);

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <p className="text-muted">Loading agent profile...</p>
            </div>
        );
    }

    if (!agent) {
        return (
            <div className="container py-5 text-center">
                <h3 className="fw-bold">Agent not found</h3>
                <p className="text-muted">The requested agent profile could not be loaded.</p>
                <Link to="/agents" className="btn btn-primary mt-3">
                    Back to agents
                </Link>
            </div>
        );
    }

    const fullName = [agent.first_name, agent.last_name]
        .filter(Boolean)
        .join(" ") || "Agent";

    return (
        <div className="container py-5">
            <div className="card shadow-sm border-0">
                <div className="card-body p-4 p-md-5">
                    <div className="d-flex flex-column flex-md-row align-items-md-center gap-4">
                        <div
                            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                            style={{ width: 96, height: 96, fontSize: "2rem" }}
                        >
                            {fullName.charAt(0).toUpperCase()}
                        </div>

                        <div>
                            <p className="text-primary fw-semibold mb-2">Verified Agent</p>
                            <h2 className="fw-bold mb-2">{fullName}</h2>
                            <p className="text-muted mb-0">
                                {agent.email || "Contact this agent for property guidance."}
                            </p>
                        </div>
                    </div>

                    <div className="row mt-4 g-4">
                        <div className="col-md-6">
                            <div className="p-4 rounded-4 bg-light h-100">
                                <h5 className="fw-bold mb-3">Contact details</h5>
                                <p className="mb-2"><strong>Phone:</strong> {agent.phone || "Not provided"}</p>
                                <p className="mb-2"><strong>Email:</strong> {agent.email || "Not provided"}</p>
                                <p className="mb-0"><strong>Role:</strong> {agent.role || "Agent"}</p>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="p-4 rounded-4 bg-light h-100">
                                <h5 className="fw-bold mb-3">About</h5>
                                <p className="text-muted mb-0">
                                    {agent.bio || "This agent is ready to help you find the right property and guide you through the process."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AgentProfile;
