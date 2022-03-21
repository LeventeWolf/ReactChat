import React from 'react';
import './Chat.scss';


export interface MessageType {
    type: 'join' | 'message';
    content: {
        username: string,
        messageValue: string,
        date: string,
    }
}

type PropTypes = {}


const Chat: React.FC<PropTypes> = ( {children} ) => {
    return (
        <div id="chat-container">
            {children}
        </div>
    );
};

export default Chat;