import React, {useEffect, useRef, useState} from "react";
import {MessageType} from "../shared/chat/Chat";
import Message from "../shared/chat/Message";
import {v4} from "uuid";
import socketService from "../../services/socketService";

interface PropTypes {
    username: string
}

const all_messages: MessageType[] = [];

export const AllChatMessageBox: React.FC<PropTypes> = ( {username} ) => {
    const [messages, setMessages] = useState<MessageType[]>([]);
    const inputChatRef = useRef<HTMLInputElement>(document.createElement("input"));

    useEffect(() => {
        if (!socketService.socket) return;
        socketService.socket.emit('join_room', {username, roomId: 'all'});
        socketService.socket.on('chat_message', (response) => {
            all_messages.unshift(response.message);
            setMessages([...all_messages])
        });
        socketService.socket.on('room_error', (message) => {
            console.log(`[${message.error.type}] ${message.error.message}`)
        })

        inputChatRef.current.addEventListener('keypress',  async (event) => {
            if (event.key === 'Enter') {
                handleSendMessage();
            }
        });

        return () => {
            if (!socketService.socket) return

            socketService.socket.emit('leave_chat');
            socketService.socket.off('chat_message');
            socketService.socket.off('update_joined');
            socketService.socket.off('partner_left');
            socketService.socket.off('room_error');
        }
    }, [])

    function handleSendMessage() {
        if (!inputChatRef.current.value) return;
        if (!socketService.socket) return;

        socketService.socket.emit('chat_message',  {
            type: 'message',
            content: {
                messageValue: inputChatRef.current.value,
                username,
                date: new Date().toTimeString().split(' ')[0],
            }
        });

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
                <span className="username">{username}</span>
                <input type="text" className="form-control send-message" placeholder="Say something nice!"
                       ref={inputChatRef}/>
                <button type="button" className="btn btn-outline-secondary"
                        onClick={handleSendMessage}>Send
                </button>
            </div>

        </div>
    );
}

export default AllChatMessageBox;