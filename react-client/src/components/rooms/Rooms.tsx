import React, {useEffect, useState} from 'react';

import socketService from "../../services/socketService";

import CreateRoom from "./CreateRoom";
import './rooms.scss';


type User = {
    id: string,
    username: string,
}

type Room = {
    id: string,
    users: User[] | undefined,
    capacity: number,
    visibility: 'public' | 'private'
}

type RoomPropsType = {
    room: Room;
}

export const Room: React.FC<RoomPropsType> = ({room}) => {
    return (
        <tr>
            <td>{room.id}</td>
            <td>{room.users?.length}</td>
            <td>Join</td>
        </tr>
    );
}


function Rooms() {
    const [rooms, setRooms] = useState<Room[]>([]);

    useEffect(() => {
        if (socketService.socket) {
            socketService.socket.on('update_rooms', (message) => {
                console.log('updating rooms')
                setRooms(message.rooms);
            });
        }
    }, [socketService.socket])

    useEffect(() => {
        if (socketService.socket) {
            socketService.socket.emit('get_rooms');
        }
    }, []);

    return (
        <div id="rooms-main">
            <h1>Rooms</h1>
            <CreateRoom/>

            {rooms.length >= 1 ?
                <div className="table-wrap">
                    <table className="table table-light">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Users</th>
                            <th>Join</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rooms.map(room => {
                            return <Room key={room.id} room={room}/>
                        })}
                        </tbody>
                    </table>
                </div>
                :
                <div className="no-rooms">No rooms created!</div>
            }

        </div>
    );
}

export default Rooms;