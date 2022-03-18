import React, {useContext, useEffect, useState} from 'react';
import {JoinRoom} from "./joinRoom";
import './home.scss';
import Chat from "../shared/chat/Chat";
import ChatContext, {ChatContextProps} from "./chatContext";
import SocketService from "../../services/socketService";
import EnterUsername from "../shared/chat/EnterUsername";
import MessageBox from "../shared/chat/MessageBox";
import AvailableUsers from "../allChat/AvailableUsers";

export const Home: React.FC = () => {
    const [isInRoom, setInRoom] = useState<boolean>(false);
    const [isJoining, setIsJoining] = useState<boolean>(false);

    const chatContextValue: ChatContextProps = {
        isInRoom, setInRoom,
        isJoining, setIsJoining,
    };

    useEffect(() => {
        if (SocketService.socket) {
            SocketService.socket.on('partner_found', (message) => {
                setIsJoining(false);
                setInRoom(true);
            });
        }
    }, [])

    if (isInRoom) {
        return (
            <ChatContext.Provider value={chatContextValue}>
                <Chat>
                    <MessageBox username={'anonymous'}/>
                </Chat>
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