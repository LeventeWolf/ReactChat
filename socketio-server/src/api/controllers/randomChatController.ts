import {ConnectedSocket, MessageBody, OnDisconnect, OnMessage, SocketController, SocketIO} from "socket-controllers";
import {Server, Socket} from "socket.io";
import {log, logt} from '../../lib/logger';
import chatData from '../services/chatDataHandler'
import socketLogger from "../services/socketLoggerService";
import socketData from "../services/socketLoggerService";
import {MessageType} from "./chatController";
import {userLeftTheRoomMessage} from "../constants/chatMessageConstants";

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

function delay(delayInms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(2);
        }, delayInms);
    });
}

@SocketController()
export class RandomChatController {
    @OnMessage("join_random_room")
    public async joinRandomRoom(@SocketIO() io: Server, @ConnectedSocket() socket: Socket, @MessageBody() message: any) {
        log(`Joining random room: ${socket.id}`);
        chatData.joiningPool.add(socket.id);

        try {
            const connectedSockets = io.sockets.adapter.rooms;

            Array.from(connectedSockets).forEach((dict, index) => {
                const roomId = dict[0];
                const sockets = dict[1];

                // Join to private room (limit: 2)
                if (chatData.joiningPool.has(roomId) && socket.id !== dict[0] && sockets.size < 2) {
                    socket.join(roomId);
                    socketLogger.updateRooms(io.sockets.adapter.rooms);
                    socketLogger.updateSocketInRoom(socket.id, roomId) // new user who joined
                    socketLogger.updateSocketInRoom(roomId, roomId) // user that already in room
                    io.to(roomId).emit('partner_found');

                    log(`Chat established: ${socket.id} - ${roomId}`)
                    sockets.forEach(socketId => {
                        chatData.joiningPool.delete(socketId);
                    })
                    return;
                }
            })
        } catch (e) {
            console.log(e)
        }

        chatData.setAdapterRooms(io.sockets.adapter.rooms)
    }



    /**
     * Handles the following cleanups when a socket had been disconnected
     * 1. If the socket was searching for partner: remove it from joingPool
     * 2. If the socket was in a room: remove it from the room,
     *  then alert partner that he left
     * @param io
     * @param socket
     */
    @OnDisconnect()
    @OnMessage('leave_random_chat')
    public async emitPartnerLeft(@SocketIO() io: Server, @ConnectedSocket() socket: Socket) {
        const socketInfo = socketLogger.getSocket(socket.id);

        // Delete the room, because at this point both sockets are in there
        if (socketInfo.data.inRoom) {
            log(`#CleanUp: Socket left from room: ${socketInfo.data.inRoom}`)
            io.to(socketInfo.data.inRoom).emit('partner_left', userLeftTheRoomMessage('partner'));

            const randomChatRoom = io.sockets.adapter.rooms.get(socketInfo.data.inRoom);
            logt(`+ Deleted RandomChat room : ${socketInfo.data.inRoom}`);
            logt(`                     users: ` + Array.from(randomChatRoom))

            // TODO socketService handleDelete
            io.sockets.adapter.rooms.delete(socketInfo.data.inRoom);
            Array.from(randomChatRoom).forEach(socketId => {
                socketLogger.updateSocketInRoom(socketId, '');

                // If socket's room has been removed, init a new room again for receiving any messages
                if (!io.sockets.adapter.rooms.get(socketId)) {
                    io.sockets.adapter.rooms.set(socketId, new Set([socketId]));
                }
            })

        }
    }
}