import React, {useContext, useEffect, useState} from 'react';
import { Navigate } from 'react-router-dom';
import Chat, {MessageType} from "../shared/chat/Chat";
import ChatContext from "../shared/chat/chatContext";
import SocketService from "../../services/socketService";
import './chatRoom.scss'
import chatContext from "../shared/chat/chatContext";

const all_messages: any = [];

const ChatRoom: React.FC = () => {
    const {isInRoom} = useContext(ChatContext);

    const [messages, setMessages] = useState<MessageType[]>([]);
    const username = SocketService.socket ? SocketService.socket.id : undefined;

    if (!isInRoom) {
        return <Navigate to="/" />
    }

    return (
        <div id="chat-room-container">
            <ChatHeader />
            <Chat all_messages={all_messages}
                  messages={messages}
                  setMessages={setMessages}
                  username={username} />
        </div>

    );
};


function ChatHeader() {
    const {roomId} = useContext(chatContext);

    return (
        <header>
            <div id="chat-room-header">
                <div className="username">username</div>
                <div className="room-id">{roomId}</div>
                <div className="number-of-users-container">
                    <span className="dot"></span>
                    <span className="users">1 / 1000</span>
                </div>
            </div>
        </header>
    );
}


export default ChatRoom;