import React, {useContext, useEffect} from 'react';
import { Navigate } from 'react-router-dom';
import Chat from "../shared/chat/Chat";
import ChatContext from "../shared/chat/chatContext";


const RandomChat: React.FC = () => {
    const {isInRoom} = useContext(ChatContext);


    if (!isInRoom) {
        return <Navigate to="/" />
    }

    return (
        <Chat/>
    );
};


export default RandomChat;