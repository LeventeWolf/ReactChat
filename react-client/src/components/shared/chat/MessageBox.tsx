import React, {useEffect, useRef, useState} from "react";
import SocketService from "../../../services/socketService";
import Message from "./Message";
import {MessageType} from "./Chat";
import './messages.scss'
import { v4 } from "uuid";
import socketService from "../../../services/socketService";


type MessageBoxPropTypes = {
    username: string,
}

const all_messages: MessageType[] = [];

export const MessageBox: React.FC<MessageBoxPropTypes> = ({username}) => {
    const [messages, setMessages] = useState<MessageType[]>([]);
    const inputChatRef = useRef<HTMLInputElement>(document.createElement("input"));

    useEffect(() => {
        if (!SocketService.socket) return;

        SocketService.socket.on('chat_message', (message) => {
            all_messages.unshift(message.message);
            setMessages([...all_messages])
        });

        inputChatRef.current.addEventListener('keypress',  async (event) => {
            if (event.key === 'Enter') {
                handleSendMessage();
            }
        });

        return () => {
            if (!SocketService.socket) return

            SocketService.socket.emit('leave_chat');
            SocketService.socket.off('chat_message');
        }
    }, [])

    function handleSendMessage() {
        if (!inputChatRef.current.value) return;
        if (!SocketService.socket) return;

        SocketService.socket.emit('chat_message',  {
            type: 'message',
            content: {
            messageValue: inputChatRef.current.value,
                username,
                date: new Date().toTimeString().split(' ')[0],
            }
        });
        console.log('emitting message!');

        inputChatRef.current.value = '';
        return;
    }

    return (
        <div className="chat-box">
            <div className="messages-wrap">
                {messages.map(messageData => {
                    return <Message key={v4()} owner={messageData.content.username === username} message={messageData}/>
                })}
            </div>

            <div className="message-send-wrap">
                {/*<span className="username">user: {username}</span>*/}
                <input type="text" className="form-control send-message" placeholder="Send something nice!"
                       ref={inputChatRef}/>
                <button type="button" className="btn btn-outline-secondary"
                        onClick={handleSendMessage}>Send
                </button>
            </div>
        </div>
    );
}

export default MessageBox;