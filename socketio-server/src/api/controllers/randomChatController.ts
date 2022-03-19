import {ConnectedSocket, MessageBody, OnMessage, SocketController, SocketIO} from "socket-controllers";
import {Server, Socket} from "socket.io";
import {log} from '../../lib/logger';
import chatData from '../services/chatDataHandler'
import socketLogger from "../services/socketLoggerService";
import socketData from "../services/socketLoggerService";
import {MessageType} from "./chatController";

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
                    socketLogger.joinRoom(socket.id, roomId) // new user who joined
                    socketLogger.joinRoom(roomId, roomId) // user that already in room
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
    @OnMessage("leave_random_chat")
    public async handleLeave(@SocketIO() io: Server, @ConnectedSocket() socket: Socket) {
        const socketInfo = socketLogger.getSocket(socket.id);

        if (socketInfo.data.inRoom) {
            log(`Partner left from room: ${socketInfo.data.inRoom}`)

            const message: MessageType = {
                type: 'join',
                content: {
                    messageValue: 'left the chat!',
                    username: 'partner',
                    date: new Date().toTimeString().split(' ')[0],
                }
            }

            io.to(socketInfo.data.inRoom).emit('partner_left', {message});
        }
    }
}