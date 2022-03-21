import React, {useEffect, useRef, useState} from "react";
import SocketService from "../../../services/socketService";
import Message from "./Message";
import {MessageType} from "./Chat";
import './messages.scss'
import {v4} from "uuid";


type MessageBoxPropTypes = {
    username: string,
}

const all_messages: MessageType[] = [];

export const MessageBox: React.FC<MessageBoxPropTypes> = ({username}) => {
    const [messages, setMessages] = useState<MessageType[]>([]);
    const inputChatRef = useRef<HTMLInputElement>(document.createElement("input"));
    const [partnerLeft, setPartnerLeft] = useState<boolean>(false);


    useEffect(() => {
        if (!SocketService.socket) return;

        SocketService.socket.on('chat_message', (response) => {
            all_messages.unshift(response.message);
            setMessages([...all_messages])
        });

        SocketService.socket.on('partner_left', (response) => {
            all_messages.unshift(response.message);
            setMessages([...all_messages])
            setPartnerLeft(true);

            if (inputChatRef.current) {
                inputChatRef.current.removeEventListener('keypress', sendMessageOnEnter);
            }

            if (!SocketService.socket) return;
            SocketService.socket.off('partner_left');
            SocketService.socket.off('chat_message');
        });


        if (inputChatRef.current) {
            inputChatRef.current.addEventListener('keypress', sendMessageOnEnter);
        }

        async function sendMessageOnEnter(event: any) {
            if (event.key === 'Enter') {
                handleSendMessage();
            }
        }

        return () => {
            if (!SocketService.socket) return

            SocketService.socket.emit('leave_random_chat');
            SocketService.socket.off('chat_message');
            SocketService.socket.off('partner_left');
        }
    }, [])

    function handleSendMessage() {
        if (!inputChatRef.current.value) return;
        if (!SocketService.socket) return;

        SocketService.socket.emit('chat_message', {
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

    function handleLeave() {
        window.location.reload(false);
    }

    return (
        <div className="chat-box">
            <div className="messages">
                {messages.map(messageData => {
                    return <Message key={v4()} owner={messageData.content.username === username} message={messageData}/>
                })}
            </div>

            {!partnerLeft ?
                <div className="message-send-wrap">
                    <button onClick={handleLeave} className="btn btn-danger btn-leave-chat">Leave</button>
                    <div className="send-message-wrap">
                        <input type="text" className="form-control send-message-input" placeholder="Say something nice!"
                               ref={inputChatRef}/>
                        <button type="button" className="btn btn-outline-secondary send-message-btn"
                                onClick={handleSendMessage}>
                            Send
                        </button>
                    </div>
                    <div>

                    </div>
                </div>
                :
                <div className="partner-left-wrapper">
                    <button onClick={handleLeave} className="btn btn-danger btn-partner-left">Leave</button>
                </div>
            }
        </div>
    );
}

export default MessageBox;