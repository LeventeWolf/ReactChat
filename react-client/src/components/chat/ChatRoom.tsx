import React, {useContext, useEffect, useState} from 'react';
import { Navigate } from 'react-router-dom';
import Chat, {MessageType} from "../shared/chat/Chat";
import ChatContext from "../shared/chat/chatContext";
import SocketService from "../../services/socketService";
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
        <Chat all_messages={all_messages}
              messages={messages}
              setMessages={setMessages}
              username={username} />
    );
};



export default ChatRoom;