import React, {useContext, useEffect, useState} from 'react';

import socketService from "../../services/socketService";

import CreateRoom from "./CreateRoom";
import './rooms.scss';
import {Room} from "./Room";
import Navbar from "../shared/navbar/Navbar";
import {Navigate} from "react-router-dom";
import ChatContext from "../shared/chat/chatContext";

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
    const [isJoined, setIsJoined] = useState(false);
    const {isInRoom} = useContext(ChatContext);

    useEffect(() => {
        if (socketService.socket) {
            socketService.socket.emit('update_rooms');
            socketService.socket.on('update_rooms', (message) => {
                updateRooms(message.rooms);
            });
            socketService.socket.on('room_error', (message) => {
                console.log(`[${message.error.type}] ${message.error.message}`)
            })
            socketService.socket.on('update_joined', (message) => {
                if (message.status === 200) {
                    console.log('joined to room')
                    setIsJoined(true);
                }
            })
        }

        return (() => {
            if (socketService.socket) {
                socketService.socket.off('update_rooms');
                socketService.socket.off('room_error');
                socketService.socket.off('update_joined');
            }
        })
    }, []);

    function updateRooms(rooms: any) {
        const roomList: RoomType[] = [];
        for (const [key, value] of Object.entries(rooms)) {
            roomList.push({roomId: key, roomData: value} as RoomType)
        }
        setRoomsList(roomList);
    }

    function handleFilter(value: string) {
        // TODO
    }

    if (isInRoom) {
        return (
            <Navigate to="/chat" />
        )
    }

    return (
        <div id="main-container">
            <Navbar />
            <div id="rooms-main">
                <h1>Rooms</h1>
                <CreateRoom handleFilter={handleFilter}/>

                {isJoined ?
                    <div> in room </div>
                    :
                    <></>
                }
                <ListOfRooms roomTypes={roomsList}/>

            </div>
        </div>
    );
}


function ListOfRooms(props: { roomTypes: RoomType[] } ) {
    if (!props.roomTypes || props.roomTypes.length == 0) {
        return <div className="no-rooms">No rooms created!</div>
    }

    return (
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
                    {props.roomTypes.map((room) => {
                        return <Room key={room.roomId} room={room}/>
                    })}
                </tbody>
            </table>
        </div>
    );
}


export default Rooms;