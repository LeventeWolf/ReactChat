import React, {useContext, useEffect, useState} from 'react';

import SocketService from "../../../services/socketService";

import './chat.scss';
import './../../../style/animations.scss';
import Messages from "./Messages";
import ChatFooter from "./ChatFooter";
import { Navigate } from 'react-router-dom';
import ChatContext from "./chatContext";


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
    const username = SocketService.socket ? SocketService.socket.id : undefined;

    useEffect(() => {
        // TODO: Alert user that reload will leave chat!
        // window.onbeforeunload = function(event) {
        //     return false;
        // };
    }, [])


    return (
        <div id="chat-container">
            <Messages username={username} messages={messages}/>
            <ChatFooter all_messages={all_messages} setMessages={setMessages} />
        </div>
    );
};

export default Chat;