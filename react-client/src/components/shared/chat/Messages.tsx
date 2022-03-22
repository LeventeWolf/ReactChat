import React from "react";
import Message from "./Message";
import {MessageType} from "./Chat";
import './messages.scss'
import {v4} from "uuid";


type MessageBoxPropTypes = {
    username: string,
    messages: MessageType[];
}

export const Messages: React.FC<MessageBoxPropTypes> = ({username, messages}) => {
    return (
        <div className="message-container">
            {messages.map(messageData => {
                return <Message key={v4()} owner={messageData.content.username === username} message={messageData}/>
            })}


            {messages.length === 0 ? <h2 className="welcome-chat-text">You can start chatting!</h2> : <></>}
        </div>
    );
}

export default Messages;