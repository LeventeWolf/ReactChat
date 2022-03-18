import React, {useContext} from 'react';
import gameContext from "../../gameContext";
import {JoinRoom} from "./joinRoom";
import './home.scss';
import Chat from "../shared/chat/Chat";

type PropTypes = {

}


export const Home: React.FC<PropTypes> = () => {
    const {isInRoom} = useContext(gameContext);

    return (
        <div className="app-container">
            <h1 className="welcome-text">Welcome to Chat.io</h1>
            <div className="main-container">
                {!isInRoom && <JoinRoom/>}
                {isInRoom && <Chat/>}
            </div>
        </div>
    );
}

export default Home;