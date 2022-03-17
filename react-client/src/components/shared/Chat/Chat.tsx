import React, {useState} from 'react';
import styled from "styled-components";
import './Chat.css';
import EnterUsername from "./EnterUsername";
import MessageBox from "./MessageBox";
import AvailableUsers from "./AvailableUsers";


const Title = styled.h1`
  width: 100%;
  text-align: center;
  color: #8e44ad;
`;


export interface MessageType {
    type: 'join' | 'message';
    content: {
        username: string,
        messageValue: string,
        date: string,
    }
}

type PropTypes = {}


const Chat: React.FC<PropTypes> = () => {
    const [username, setUsername] = useState('');
    const [isJoined, setIsJoined] = useState(false)


    return (
        <div id="main">
            <Title>Chat</Title>
            <div id="chat-container">
                {!isJoined ?
                    <EnterUsername setUsername={setUsername} setIsJoined={setIsJoined}/>
                    :
                    <MessageBox username={username}/>
                }
                <AvailableUsers />
            </div>
        </div>
    );
};

export default Chat;