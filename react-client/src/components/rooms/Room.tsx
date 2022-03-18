import React, {useContext} from "react";
import {RoomType} from "./Rooms";
import socketService from "../../services/socketService";

type RoomPropsType = {
    room: RoomType
}

export const Room: React.FC<RoomPropsType> = ({room}) => {
    function handleJoinRoom() {
        if (socketService.socket) {
            socketService.socket.emit('join_room', {roomId: room.roomId})
        }
    }

    return (
        <tr>
            <td>{room.roomId}</td>
            <td className="text-center"> {room.roomData.sockets.length} / { room.roomData.capacity}</td>
            <td className="text-end">
                <button className="btn btn-outline-success btn-sm" type="button" onClick={handleJoinRoom}>
                    Join
                </button>
            </td>
        </tr>
    );
}