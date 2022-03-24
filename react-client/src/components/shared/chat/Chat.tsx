import React from 'react';

import './chat.scss';
import './../../../style/animations.scss';
import Messages from "./Messages";
import ChatFooter from "./ChatFooter";


export interface MessageType {
    type: 'join' | 'message';
    content: {
        username: string | undefined,
        messageValue: string,
        date: string,
    }
}


type PropTypes = {
    all_messages: any,
    messages: any,
    setMessages: any,
    username: string | undefined,
}

const Chat: React.FC<PropTypes> = ( {all_messages, username, messages, setMessages} ) => {

    return (
        <div id="chat-container">
            <Messages username={username} messages={messages}/>
            <ChatFooter all_messages={all_messages} setMessages={setMessages} />
        </div>
    );
};

export default Chat;