import React, {useLayoutEffect, useState} from "react";

import socketService from "./services/socketService";

import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Rooms from "./components/rooms/Rooms";
import Home from "./components/home/Home";
import RandomRoom from "./components/chat/RandomRoom";
import ChatContext, {ChatContextProps} from "./components/shared/chat/chatContext";


export const connectSocket = async () => {
    await socketService.connect("http://192.168.0.22:9000")
        .catch((err) => {
            console.log("Error: ", err);
        });
}


function App() {
    const [isInRoom, setInRoom] = useState<boolean>(false);
    const [isJoining, setIsJoining] = useState<boolean>(false);

    const chatContextValue: ChatContextProps = {
        isInRoom, setInRoom,
        isJoining, setIsJoining,
    };


    useLayoutEffect(() => {
        if (!socketService.socket) {
            connectSocket();
        }
    }, [])

    return (
        <ChatContext.Provider value={chatContextValue}>
            <Router>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/rooms" element={<Rooms/>}/>
                    <Route path="/chat/random" element={<RandomRoom/>}/>
                    <Route path="/chat/rooms" element={<RandomRoom/>}/>
                    {/*<Route path="/chat" element={<AllChat/>}/>*/}
                </Routes>
            </Router>
        </ChatContext.Provider>
    );
}

export default App;
