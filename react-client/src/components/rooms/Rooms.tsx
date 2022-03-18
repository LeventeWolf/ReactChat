import React, {useEffect, useState} from 'react';

import socketService from "../../services/socketService";

import CreateRoom from "./CreateRoom";
import './rooms.scss';
import {Room} from "./Room";

export interface RoomType {
    roomId: string,
    roomData: {
        sockets: string[],
        messages: [],
        capacity: number,
        visibility: 'public' | 'private'
    }
}


export type User = {
    id: string,
    username: string,
}

function Rooms() {
    const [roomsList, setRoomsList] = useState<RoomType[]>([]);

    useEffect(() => {
        if (socketService.socket) {
            socketService.socket.emit('load_rooms');
            socketService.socket.on('update_rooms', (message) => {
                const roomList: RoomType[] = [];
                for (const [key, value] of Object.entries(message.rooms)) {
                    roomList.push({roomId: key, roomData: value} as RoomType)
                }
                setRoomsList(roomList);
            });
            socketService.socket.on('room_error', (message) => {
                if (message.error.type === 'room_exists_error') {
                    console.log(`[${message.error.type}] ${message.error.message}`)
                }
            })
        }
    }, []);

    function handleFilter(value: string) {
        // TODO
    }

    return (
        <div id="rooms-main">
            <h1>Rooms</h1>
            <CreateRoom handleFilter={handleFilter}/>

            {roomsList.length >= 1 ?
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
                            {roomsList.map((r: any) => {
                                return <Room key={r.roomId} room={r}/>
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