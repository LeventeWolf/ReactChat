import React, {useEffect, useState} from 'react';

import socketService from "../../services/socketService";

import CreateRoom from "./CreateRoom";
import './rooms.scss';


export type User = {
    id: string,
    username: string,
}

export type Room = {
    id: string,
    users: User[] | undefined,
    capacity: number,
    visibility: 'public' | 'private'
}

type RoomPropsType = {
    room: Room;
}

export const Room: React.FC<RoomPropsType> = ({room}) => {
    function handleJoinRoom() {

    }

    return (
        <tr>
            <td>{room.id}</td>
            <td className="text-center">{room.users?.length}</td>
            <td className="text-end">
                <button className="btn btn-outline-success btn-sm" type="button" onClick={handleJoinRoom}>
                    Join
                </button>
            </td>
        </tr>
    );
}


function Rooms() {
    const [rooms, setRooms] = useState<Room[]>([]);

    useEffect(() => {
        if (socketService.socket) {
            socketService.socket.on('update_rooms', (message) => {
                setRooms(message.rooms);
            });
        }
    }, [socketService.socket])

    useEffect(() => {
        if (socketService.socket) {
            console.log('constructor load')
            socketService.socket.emit('load_rooms');
        }
    }, []);

    function handleFilter(value: string) {
        // TODO
    }

    return (
        <div id="rooms-main">
            <h1>Rooms</h1>
            <CreateRoom handleFilter={handleFilter}/>

            {rooms.length >= 1 ?
                <div className="table-wrap">
                    <table className="table table-light">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th className="text-center">Users</th>
                            <th className="text-end">Join</th>
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