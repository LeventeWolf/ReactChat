import React, {useEffect, useRef, useState} from "react";
import SocketService from "../../../services/socketService";
import Message from "./Message";
import {MessageType} from "./Chat";
import './messages.css'
import { v4 } from "uuid";


type MessageBoxPropTypes = {
    username: string,
}

export const MessageBox: React.FC<MessageBoxPropTypes> = ({username}) => {
    const [messages, setMessages] = useState<MessageType[]>([]);
    const inputChatRef = useRef<HTMLInputElement>(document.createElement("input"));

    useEffect(() => {
        if (SocketService.socket) {
            SocketService.socket.on('chat_message', (message) => {
                setMessages(message.messages);
            });
        }
    }, [SocketService.socket])

    useEffect(() => {
        inputChatRef.current.addEventListener('keypress',  async (event) => {
            if (event.key === 'Enter') {
                handleSendMessage();
            }
        });

        if (SocketService.socket) {
            SocketService.socket.emit('chat_message');
        }

        return () => {
            if (SocketService.socket) {
                SocketService.socket.emit('leave_chat', {username});
            }
        }
    }, [])

    function handleSendMessage() {
        if (!inputChatRef.current.value) return;

        const messageData: MessageType = {
            type: 'message',
            content: {
                messageValue: inputChatRef.current.value,
                username,
                date: new Date().toTimeString().split(' ')[0],
            }
        }

        setMessages([messageData, ...messages]);

        if (SocketService.socket) {
            SocketService.socket.emit('chat_message', messageData);
        }

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
                <span className="username">user: {username}</span>
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