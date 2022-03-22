import React, {useContext} from 'react';
import { Navigate } from 'react-router-dom';
import Chat from "../shared/chat/Chat";
import ChatContext from "../shared/chat/chatContext";


const ChatRoom: React.FC = () => {
    const {isInRoom} = useContext(ChatContext);


    if (!isInRoom) {
        return <Navigate to="/" />
    }

    return (
        <Chat/>
    );
};


export default ChatRoom;