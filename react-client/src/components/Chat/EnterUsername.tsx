import React, {useRef} from "react";
import './enterUsername.scss'
import SocketService from "../../services/socketService";
import {MessageType} from "./Chat";

type EnterUsernamePropTypes = {
    setIsJoined: any,
    setUsername: any,
}

const EnterUsername: React.FC<EnterUsernamePropTypes> = ({setIsJoined, setUsername}) => {
    const inputUsernameRef = useRef<HTMLInputElement>(document.createElement("input"));

    function handleJoin() {
        const username: any = inputUsernameRef.current.value;
        if (!username) {
            alert('Please enter your name!')
            return;
        }

        if (SocketService.socket) {
            SocketService.socket.emit('join_chat', {username})
            setIsJoined(true);
            setUsername(username);

            const messageData: MessageType = {
                type: 'join',
                content: {
                    messageValue: 'joined the chat!',
                    username,
                    date: new Date().toTimeString().split(' ')[0],
                }
            }
            SocketService.socket.emit('chat_message', messageData)
        }
    }

    return (
        <div className="chat-box-username">
            <div className="center">
                <input type="text" className="form-control" placeholder="Enter your name!"
                       ref={inputUsernameRef}/>
                <button type="button" className="btn btn-outline-secondary"
                        onClick={handleJoin}>Join
                </button>
            </div>
        </div>
    );
};

export default EnterUsername;