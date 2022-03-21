import React, {useContext, useEffect, useState} from 'react';
import {JoinRoom} from "./joinRoom";
import './home.scss';
import Chat from "../shared/chat/Chat";
import ChatContext, {ChatContextProps} from "./chatContext";
import SocketService from "../../services/socketService";
import MessageBox from "../shared/chat/MessageBox";

export const Home: React.FC = () => {
    const [isInRoom, setInRoom] = useState<boolean>(false);
    const [isJoining, setIsJoining] = useState<boolean>(false);
    const [partnerLeft, setPartnerLeft] = useState<boolean>(false);

    const chatContextValue: ChatContextProps = {
        isInRoom, setInRoom,
        isJoining, setIsJoining,
        // partnerLeft, setPartnerLeft,
    };


    useEffect(() => {
        if (!SocketService.socket) return;

        SocketService.socket.on('partner_found', (message) => {
            setIsJoining(false);
            setInRoom(true);
        });


        return (() => {
            if (!SocketService.socket) return;
            SocketService.socket.off('partner_found');
        })
    }, [])

    if (isInRoom) {
        return (
            <ChatContext.Provider value={chatContextValue}>
                {/* @ts-ignore */}
                <MessageBox username={SocketService.socket.id}/>
            </ChatContext.Provider>
        )
    }

    return (
        <ChatContext.Provider value={chatContextValue}>
            <div className="app-container">
                <h1 className="welcome-text">Welcome to Chat.io</h1>
                <div className="main-container">
                    <JoinRoom/>
                </div>
            </div>
        </ChatContext.Provider>
    );
}

export default Home;