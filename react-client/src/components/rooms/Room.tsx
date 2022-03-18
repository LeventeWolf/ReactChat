import React from "react";
import {RoomType} from "./Rooms";

type RoomPropsType = {
    room: RoomType
}

export const Room: React.FC<RoomPropsType> = ({room}) => {
    function handleJoinRoom() {

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