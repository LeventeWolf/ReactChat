import React, {useContext, useEffect, useState} from 'react';
import { Navigate } from 'react-router-dom';
import Chat, {MessageType} from "../shared/chat/Chat";
import ChatContext from "../shared/chat/chatContext";
import SocketService from "../../services/socketService";
import chatContext from '../shared/chat/chatContext';


const all_messages: any = [];

const RandomRoom: React.FC = () => {
    const {isInRoom} = useContext(ChatContext);

    const [messages, setMessages] = useState<MessageType[]>([]);
    const username = SocketService.socket ? SocketService.socket.id : undefined;
    const {setPartnerLeft} = useContext(chatContext);

    useEffect(() => {
        if (!SocketService.socket) return;

        SocketService.socket.on('partner_left', (response) => handlePartnerLeft(response));

        return (() => {
            if (!SocketService.socket) return;
            SocketService.socket.off('partner_left');
        })
    }, [])

    function handlePartnerLeft(response: any) {
        all_messages.unshift(response.message);
        setMessages([...all_messages])
        setPartnerLeft(true);
    }


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


export default RandomRoom;