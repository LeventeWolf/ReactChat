import React, {useLayoutEffect, useState} from "react";

import socketService from "./services/socketService";
import GameContext, {IGameContextProps} from "./gameContext";

import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Navbar from "./components/shared/navbar/Navbar";
import Rooms from "./components/rooms/Rooms";
import Home from "./components/home/Home";
import AllChat from "./components/allChat/AllChat";


export const connectSocket = async () => {
    await socketService.connect("http://192.168.0.22:9000")
        .catch((err) => {
            console.log("Error: ", err);
        });
}


function App() {
    const [isInRoom, setInRoom] = useState(false);
    const [playerSymbol, setPlayerSymbol] = useState<"x" | "o">("x");
    const [isPlayerTurn, setPlayerTurn] = useState(false);
    const [isGameStarted, setGameStarted] = useState(false);

    const gameContextValue: IGameContextProps = {
        isInRoom, setInRoom,
        playerSymbol, setPlayerSymbol,
        isPlayerTurn, setPlayerTurn,
        isGameStarted, setGameStarted,
    };

    useLayoutEffect(() => {
        if (!socketService.socket) {
            connectSocket();
        }
    }, [])

    return (
        <GameContext.Provider value={gameContextValue}>
            <Router>
                <Navbar/>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/rooms" element={<Rooms/>}/>
                    <Route path="/chat" element={<AllChat/>}/>
                </Routes>
            </Router>
        </GameContext.Provider>
    );
}

export default App;
