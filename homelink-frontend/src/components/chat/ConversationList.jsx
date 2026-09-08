import { useEffect, useState } from "react";
import chatService from "../../services/chatService";

function ConversationList({

    onSelect,

}){

    const [conversations,setConversations]=useState([]);

    useEffect(()=>{

        loadConversations();

    },[]);

    const loadConversations=async()=>{

        const data=
            await chatService.getConversations();

        setConversations(data);

    };

    return(

        <div className="list-group">

            {

                conversations.map((conversation)=>(

                    <button

                        key={conversation.id}

                        className="list-group-item list-group-item-action"

                        onClick={()=>onSelect(conversation)}

                    >

                        <strong>

                            {conversation.property_title}

                        </strong>

                        <br/>

                        <small>

                            {

                                conversation.last_message?.message ||

                                "No messages"

                            }

                        </small>

                    </button>

                ))

            }

        </div>

    );

}

export default ConversationList;