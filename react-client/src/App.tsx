import React, {useContext, useLayoutEffect, useState} from "react";

import socketService from "./services/socketService";
import GameContext, {IGameContextProps} from "./gameContext";
import {JoinRoom} from "./components/joinRoom";
import {Game} from "./components/game";

import styled from "styled-components";
import "./App.css";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Navbar from "./components/shared/Navbar";
import Rooms from "./components/rooms/Rooms";
import gameContext from "./gameContext";
import Chat from "./components/shared/Chat/Chat";

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const WelcomeText = styled.h1`
  color: #8e44ad;
  margin-top: 100px;
`;

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function Home() {
    const {isInRoom} = useContext(gameContext);

    return (
        <AppContainer>
            <WelcomeText>Welcome to Chat.io</WelcomeText>
            <MainContainer>
                {!isInRoom && <JoinRoom/>}
                {isInRoom && <Game/>}
            </MainContainer>
        </AppContainer>
    );
}

export const connectSocket = async () => {
    await socketService.connect("http://192.168.0.22:9000")
        .then((socket) => {
            console.log('Connected to localhost:9000')
            console.log('Client id: ' + socket.id)
        }).catch((err) => {
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
