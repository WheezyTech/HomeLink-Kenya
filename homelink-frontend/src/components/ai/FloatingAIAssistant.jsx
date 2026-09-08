import { useState } from "react";
import toast from "react-hot-toast";
import {
    FaMapMarkerAlt,
    FaPaperPlane,
    FaRobot,
    FaTimes,
} from "react-icons/fa";

import aiService from "../../services/aiService";
import "../../styles/floating-ai.css";

function FloatingAIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [answer, setAnswer] = useState("");
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);

    const searchProperties = async (event) => {
        event.preventDefault();

        if (!message.trim()) {
            toast.error("Tell AI what you are looking for.");
            return;
        }

        try {
            setLoading(true);
            setAnswer("");
            setProperties([]);

            const data = await aiService.smartAssistant(message.trim());
            setAnswer(data.answer || "");
            setProperties(data.properties || []);
        } catch (error) {
            toast.error(error?.response?.data?.message || "AI search failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="floating-ai">
            {isOpen && (
                <section className="floating-ai-panel" aria-label="Ask AI">
                    <header className="floating-ai-header">
                        <div>
                            <span className="floating-ai-eyebrow">
                                <FaRobot /> HomeLink AI
                            </span>
                            <h2>Find your next home</h2>
                        </div>
                        <button
                            type="button"
                            className="floating-ai-close"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close Ask AI"
                            title="Close"
                        >
                            <FaTimes />
                        </button>
                    </header>

                    <form className="floating-ai-form" onSubmit={searchProperties}>
                        <label htmlFor="floating-ai-message">What are you looking for?</label>
                        <div className="floating-ai-input-row">
                            <input
                                id="floating-ai-message"
                                type="text"
                                placeholder="2 bedroom house under 30,000 in Nairobi"
                                value={message}
                                onChange={(event) => setMessage(event.target.value)}
                            />
                            <button
                                type="submit"
                                className="floating-ai-send"
                                disabled={loading}
                                aria-label="Ask AI"
                                title="Ask AI"
                            >
                                <FaPaperPlane />
                            </button>
                        </div>
                    </form>

                    {loading && <p className="floating-ai-status">Searching properties...</p>}
                    {answer && <p className="floating-ai-answer">{answer}</p>}

                    {properties.length > 0 && (
                        <div className="floating-ai-results">
                            {properties.map((property) => (
                                <a
                                    className="floating-ai-property"
                                    href={`/properties/${property.id}`}
                                    key={property.id}
                                >
                                    <div>
                                        <strong>{property.title}</strong>
                                        <span>
                                            <FaMapMarkerAlt /> {property.estate || property.county}
                                        </span>
                                    </div>
                                    <b>KSh {Number(property.price).toLocaleString()}</b>
                                </a>
                            ))}
                        </div>
                    )}
                </section>
            )}

            <button
                type="button"
                className="floating-ai-trigger"
                onClick={() => setIsOpen((open) => !open)}
                aria-expanded={isOpen}
                aria-label={isOpen ? "Close Ask AI" : "Ask AI"}
            >
                {isOpen ? <FaTimes /> : <FaRobot />}
                <span>Ask AI</span>
            </button>
        </div>
    );
}

export default FloatingAIAssistant;
