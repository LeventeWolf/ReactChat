import React, {useEffect} from 'react';

import SocketService from "../../services/socketService";
import './home.scss';

import { JoinRoom } from "./joinRoom";
import { Navigate } from "react-router-dom";
import { useContext } from 'react';
import ChatContext from "../shared/chat/chatContext";
import Navbar from "../shared/navbar/Navbar";

export const Home: React.FC = () => {
    const {isInRoom, setInRoom, isJoining, setIsJoining} = useContext(ChatContext);

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
            <Navigate to="chat" />
        )
    }

    return (
        <div className="app-container">
            <Navbar/>

            <h1 className="welcome-text">Welcome to Chat.io</h1>
            <div className="main-container">
                <JoinRoom/>
            </div>
        </div>
    );
}

export default Home;