import React, {useEffect, useState} from 'react';

import SocketService from "../../services/socketService";
import './rooms.scss';
import socketService from "../../services/socketService";

type RoomType = {
    id: string
}

export const Room: React.FC<RoomType> = ({id}) => {
    return (
        <div className="room-wrap">
            {id}
        </div>
    );
}

function Rooms() {
    const [rooms, setRooms] = useState<String[]>([]);

    useEffect(() => {
        if (socketService.socket) {
            socketService.socket.on('all_rooms', (message) => {
                console.log('all_rooms!: ', message.rooms)
                setRooms(message.rooms);
            });
        }
    }, [socketService.socket])

    useEffect(() => {
        if (socketService.socket) {
            socketService.socket.emit('get_all_rooms');
        }
    }, []);

    return (
        <div id="main">
            <h1>Rooms</h1>
            <div className="room-container">
                {rooms?.map((name: any) => {return <Room key={name} id={name} />})}
            </div>
        </div>
    );
}

export default Rooms;