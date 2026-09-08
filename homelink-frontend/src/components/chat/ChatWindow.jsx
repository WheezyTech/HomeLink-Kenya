import { useEffect,useState } from "react";

import chatService from "../../services/chatService";

function ChatWindow({

    conversation,

}){

    const [messages,setMessages]=useState([]);

    useEffect(()=>{

        if(conversation){

            loadMessages();

        }

    },[conversation]);

    const loadMessages=async()=>{

        const data=

        await chatService.getMessages(

            conversation.id

        );

        setMessages(data);

    };

    if(!conversation){

        return(

            <div className="text-center mt-5">

                Select a conversation

            </div>

        );

    }

    return(

        <div>

            <h4>

                {

                    conversation.property_title

                }

            </h4>

            <hr/>

            {

                messages.map((message)=>(

                    <div

                        key={message.id}

                        className="mb-3"

                    >

                        <strong>

                            {

                                message.sender_name

                            }

                        </strong>

                        <br/>

                        {

                            message.message

                        }

                    </div>

                ))

            }

        </div>

    );

}

export default ChatWindow;