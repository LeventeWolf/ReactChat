import React, {useEffect, useRef, useState} from 'react';
import SocketService from "../../../services/socketService";
import SendIcon from '@mui/icons-material/Send';
import MenuIcon from '@mui/icons-material/Menu';
import ReturnIcon from '@mui/icons-material/KeyboardReturn';
import './chatFooter.scss';
import './../../../style/animations.scss';

type PropTypes = {
    all_messages: any;
    setMessages: any;
}

const ChatFooter: React.FC<PropTypes> = ( {all_messages, setMessages} ) => {
    const [partnerLeft, setPartnerLeft] = useState<boolean>(false);
    const [isNavToggled, setNavToggled] = useState<boolean>(false);
    const inputChatRef = useRef<HTMLInputElement>(document.createElement("input"));

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

    function sendMessageOnEnter(event: any) {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    }

    function handleLeave() {
        window.location.reload(false);
    }

    // Send messages by pressing key='Enter'
    useEffect(() => {
        if (inputChatRef.current) {
            inputChatRef.current.addEventListener('keypress', sendMessageOnEnter);
        }
    }, [inputChatRef.current])


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

    if (isNavToggled) {
        return (
            <div id="chat-footer">
                <button type="button" className="btn btn-outline"
                        onClick={() => setNavToggled(!isNavToggled)}>
                    <ReturnIcon/>
                </button>
                <button onClick={handleLeave} className="btn btn-danger btn-leave-chat">
                    Leave
                </button>

                <button disabled={true} type="button" className="btn btn-outline">

                </button>
            </div>
        );
    }


    return (
        <div id="chat-footer">
            <button type="button" className="btn btn-outline"
                    onClick={() => setNavToggled(!isNavToggled)}>
                <MenuIcon />
            </button>

            <input type="text" className="form-control" placeholder="Say something nice!" ref={inputChatRef}/>

            <button type="button" className="btn btn-outline"
                    onClick={handleSendMessage}>
                <SendIcon color={'primary'} />
            </button>
        </div>
    );
};

export default ChatFooter;