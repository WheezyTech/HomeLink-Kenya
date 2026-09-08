import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import ConversationList from "../../components/chat/ConversationList";
import ChatWindow from "../../components/chat/ChatWindow";
import chatService from "../../services/chatService";

function Chat() {
    const [conversation, setConversation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchParams] = useSearchParams();
    const propertyId = searchParams.get("property");

    useEffect(() => {
        const openPropertyConversation = async () => {
            if (!propertyId) {
                return;
            }

            try {
                setLoading(true);
                setError("");
                const data = await chatService.startConversation(propertyId);
                setConversation(data);
            } catch (err) {
                console.error(err);
                setError("We couldn't open that conversation right now.");
            } finally {
                setLoading(false);
            }
        };

        openPropertyConversation();
    }, [propertyId]);

    return (
        <DashboardLayout>
            <div className="row">
                <div className="col-lg-4">
                    <ConversationList onSelect={setConversation} />
                </div>

                <div className="col-lg-8">
                    {loading ? (
                        <div className="text-center mt-5 text-muted">
                            Opening conversation...
                        </div>
                    ) : error ? (
                        <div className="alert alert-danger mt-4">
                            {error}
                        </div>
                    ) : (
                        <ChatWindow conversation={conversation} />
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

export default Chat;