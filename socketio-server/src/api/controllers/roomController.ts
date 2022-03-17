import {ConnectedSocket, MessageBody, OnMessage, SocketController, SocketIO} from "socket-controllers";
import {Server, Socket} from "socket.io";
import {log} from '../../lib/logger';
import chatData from '../data/chatDataHandler'

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

@SocketController()
export class RoomController {

    @OnMessage("new_room")
    public async createNewRoom(@SocketIO() io: Server, @ConnectedSocket() socket: Socket, @MessageBody() message: any) {
        log('#Creating new room!')
        const roomId = message.roomId;
        const roomData = {
            users: [],
            messages: [],
            capacity: 1000,
            visibility: 'public',
        }
        const rooms = io.sockets.adapter.rooms;

        chatData.roomsData[roomId] = roomData;

        socket.join(message.id);

        console.log('<rooms>')
        rooms.forEach((sockets, roomId, map) => {
            console.log(sockets, roomId)
        });

        log('emitting update!')
        io.emit('update_rooms', {rooms: []})
    }


    @OnMessage("load_rooms")
    public async getRooms(@SocketIO() io: Server, @ConnectedSocket() socket: Socket, @MessageBody() message: any) {
        io.emit('update_rooms', {rooms: chatData.rooms})
    }
}


// @OnMessage("join_game")
// public async joinGame(@SocketIO() io: Server, @ConnectedSocket() socket: Socket, @MessageBody() message: any) {
//     console.log("New User joining room: ", message);
//     const connectedSockets = io.sockets.adapter.rooms.get(message.roomId);
//     const socketRooms = Array.from(socket.rooms.values()).filter((r) => r !== socket.id);
//
//     if (socketRooms.length > 0 || (connectedSockets && connectedSockets.size === 2)) {
//         socket.emit("room_join_error", {
//             error: "Room is full please choose another room to play!",
//         });
//     } else {
//         await socket.join(message.roomId);
//         socket.emit("room_joined");
//
//         if (io.sockets.adapter.rooms.get(message.roomId).size === 2) {
//             socket.emit("start_game", { start: true, symbol: "x" });
//             socket.to(message.roomId).emit("start_game", { start: false, symbol: "o" });
//         }
//     }
//
//     console.log(io.sockets.adapter.rooms)
// }