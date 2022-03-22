import React, {useState} from 'react';

import SocketService from "../../../services/socketService";

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

const all_messages: any = [];

const Chat: React.FC = ( ) => {
    const [messages, setMessages] = useState<MessageType[]>([]);

    return (
        <div id="chat-container">
            {/* @ts-ignore */}
            <Messages username={SocketService.socket.id} messages={messages}/>
            <ChatFooter all_messages={all_messages} setMessages={setMessages} />
        </div>
    );
};

export default Chat;