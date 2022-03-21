import React, {useEffect, useRef, useState} from 'react';
import SocketService from "../../../services/socketService";
import SendIcon from '@mui/icons-material/Send';
import './chatFooter.scss';

type PropTypes = {
    all_messages: any;
    setMessages: any;
}

const ChatFooter: React.FC<PropTypes> = ( {all_messages, setMessages} ) => {
    const [partnerLeft, setPartnerLeft] = useState<boolean>(false);

    const inputChatRef = useRef<HTMLInputElement>(document.createElement("input"));
    function handleLeave() {
        window.location.reload(false);
    }

    useEffect(() => {
        if (!SocketService.socket) return;

        SocketService.socket.on('chat_message', (response) => {
            all_messages.push(response.message);
            setMessages([...all_messages])
        });

        SocketService.socket.on('partner_left', (response) => {
            all_messages.push(response.message);
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
                username: SocketService.socket.id,
                date: new Date().toTimeString().split(' ')[0],
            }
        });
        console.log('emitting message!');

        inputChatRef.current.value = '';
        return;
    }


    if (partnerLeft) {
        return (
            <div id="chat-footer-leave">
                <button className="btn btn-danger btn-partner-left"
                        onClick={handleLeave}>
                    Leave
                </button>
            </div>
        )
    }

    return (
        <div id="chat-footer">
            <button onClick={handleLeave} className="btn btn-danger btn-leave-chat">
                Leave
            </button>

            <input type="text" className="form-control" placeholder="Say something nice!"
                   ref={inputChatRef}/>

            <button type="button" className="btn btn-outline"
                    onClick={handleSendMessage}>
                <SendIcon color={'primary'} />
            </button>
        </div>
    );
};

export default ChatFooter;