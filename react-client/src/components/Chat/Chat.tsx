import React, {useState} from 'react';
import './Chat.scss';
import EnterUsername from "./EnterUsername";
import MessageBox from "./MessageBox";
import AvailableUsers from "./AvailableUsers";


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
            <h1 className="title">Chat</h1>
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