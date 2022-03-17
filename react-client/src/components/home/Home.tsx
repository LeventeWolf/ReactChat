import React, {useContext} from 'react';
import gameContext from "../../gameContext";
import {JoinRoom} from "../joinRoom";
import {Game} from "../game";
import './home.scss';

type PropTypes = {

}


export const Home: React.FC<PropTypes> = () => {
    const {isInRoom} = useContext(gameContext);

    return (
        <div className="app-container">
            <h1 className="welcome-text">Welcome to Chat.io</h1>
            <div className="main-container">
                {!isInRoom && <JoinRoom/>}
                {isInRoom && <Game/>}
            </div>
        </div>
    );
}

export default Home;