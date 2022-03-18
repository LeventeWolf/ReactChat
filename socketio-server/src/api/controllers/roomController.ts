import {ConnectedSocket, MessageBody, OnMessage, SocketController, SocketIO} from "socket-controllers";
import {Server, Socket} from "socket.io";
import {log} from '../../lib/logger';
import chatData from '../data/chatDataHandler'

type User = {
    id: string,
    username: string,
}

type Room = {
    sockets: string[],
    messages: [],
    capacity: number,
    visibility: 'public' | 'private'
}

@SocketController()
export class RoomController {

    @OnMessage("new_room")
    public async createNewRoom(@SocketIO() io: Server, @ConnectedSocket() socket: Socket, @MessageBody() message: any) {
        log('#Creating new room!')
        console.log(`roomId: ${message.roomId}`)

        createNewRoom(message.roomId)
        const rooms = chatData.rooms;
        console.log(rooms)
        io.emit('update_rooms', {rooms})
        log('rooms emitted!')

        function createNewRoom(roomId: string) {
            if (chatData.rooms[roomId]) {
                console.log('room already created');
                const error = {
                    type: 'room_exists_error',
                    message: 'room already exists'
                }
                io.emit('room_error', {error})
                return
            }

            chatData.rooms[roomId] = {
                sockets: [],
                messages: [],
                capacity: 1000,
                visibility: 'public',
            };
        }
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

//
// rooms = io.sockets.adapter.rooms;
//
// socket.join(roomId);
// const convertedMap = convertMapToList(rooms);
// const filteredRooms = convertedMap.filter((room: any) => !room.sockets.includes(room.id));
//
// log('emitting update!')
// io.emit('update_rooms', {rooms: filteredRooms})
//
// function convertMapToList(rooms: Map<string, Set<string>>) {
//     const result = [];
//     for (const roomEntry of Array.from(rooms)) {
//         const room = {
//             id: roomEntry[0],
//             sockets: Array.from(roomEntry[1])
//         }
//         result.push(room);
//     }
//     return result;
// }
