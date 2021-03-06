import React from "react";
import './messages.scss'
import {MessageType} from "./Chat";

type MessagePropTypes = {
    message: MessageType;
    owner: boolean
}

const Message: React.FC<MessagePropTypes> = ({message, owner}) => {
    if (message.type === 'join') {
        return <div className="message-join">
            {message.content.username} {message.content.messageValue}
        </div>
    }

    if (owner) {
        return (
            <div className="chat-message-wrap owner">
                {/*<span className="message-date">{message.content.date}</span>*/}
                {/*<span className="message-username">{message.content.username}</span>*/}
                <div className="message-text">{message.content.messageValue}</div>
            </div>
        );
    }


    return (
        <div className="chat-message-wrap other">
            {/*<span className="message-username">{message.content.username}</span>*/}
            {/*<span className="message-date">{message.content.date}</span>*/}
            <div className="message-text">{message.content.messageValue}</div>
        </div>
    );
};

export default Message;