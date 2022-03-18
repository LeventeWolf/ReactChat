import React, {useEffect, useLayoutEffect, useState} from "react";

import socketService from "./services/socketService";
import GameContext, {IGameContextProps} from "./gameContext";

import "./App.css";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Navbar from "./components/shared/navbar/Navbar";
import Rooms from "./components/rooms/Rooms";
import Chat from "./components/shared/chat/Chat";
import Home from "./components/home/Home";


export const connectSocket = async () => {
    await socketService.connect("http://localhost:9000").
        catch((err) => {
            console.log("Error: ", err);
        });
};

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
                    <Route path="/chat" element={<Chat/>}/>
                </Routes>
            </Router>,
        </GameContext.Provider>
    );
}

export default App;
