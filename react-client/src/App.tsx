import React, {useLayoutEffect, useState} from "react";

import socketService from "./services/socketService";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Rooms from "./components/rooms/Rooms";
import Home from "./components/home/Home";
import RandomRoom from "./components/chat/RandomRoom";
import ChatContext, {ChatContextProps} from "./components/shared/chat/chatContext";
import ChatRoom from "./components/chat/ChatRoom";
import PageNotFound from "./components/pageNotFound/PageNotFound";
import config from "./shared/config";


export const connectSocket = async () => {
    console.log(`Connecting to Socket.IO on: ${config.socketIoServerUrl}`);
    await socketService.connect(config.socketIoServerUrl)
        .catch((err) => {
            console.log("Error: ", err);
        });
}


function App() {
    const [isInRoom, setInRoom] = useState<boolean>(false);
    const [isJoining, setIsJoining] = useState<boolean>(false);
    const [partnerLeft, setPartnerLeft] = useState<boolean>(false);
    const [roomId, setRoomId] = useState<string>('');

    const chatContextValue: ChatContextProps = {
        isInRoom, setInRoom,
        isJoining, setIsJoining,
        partnerLeft, setPartnerLeft,
        roomId, setRoomId,
    };


    useLayoutEffect(() => {
        if (!socketService.socket) {
            connectSocket();
        }
    }, [])

    return (
        <ChatContext.Provider value={chatContextValue}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="/rooms" element={<Rooms/>}/>
                    <Route path="/chat/random" element={<RandomRoom/>}/>
                    <Route path="/chat/rooms" element={<ChatRoom/>}/>
                    <Route path="*" element={<PageNotFound/>}/>
                </Routes>
            </BrowserRouter>
        </ChatContext.Provider>
    );
}

export default App;
