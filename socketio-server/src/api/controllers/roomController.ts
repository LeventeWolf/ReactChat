import {ConnectedSocket, MessageBody, OnMessage, SocketController, SocketIO} from "socket-controllers";
import {Server, Socket} from "socket.io";
import {log} from '../../lib/logger';
import chatData from '../services/chatDataHandler'
import socketLogger from "../services/socketLoggerService";
import {MessageType} from "./chatController";
import socketData from "../services/socketLoggerService";

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
        try {
            log(`#Creating new room: id=${message.roomId}`)
            chatData.createNewRoom(message.roomId)
            await this.ioEmitRooms(io)
        } catch (e) {
            await this.ioEmitError(io, e);
            log('#Joining new room err.: ' + e.message)
        }
    }

    @OnMessage("update_rooms")
    public async ioEmitRooms(@SocketIO() io: Server) {
        io.emit('update_rooms', {rooms: chatData.rooms})
    }

    @OnMessage("join_room")
    public async joinRoom(@SocketIO() io: Server, @ConnectedSocket() socket: Socket, @MessageBody() message: any) {
        try {
            chatData.joinRoom(message.roomId, socket.id);
            await this.ioEmitRooms(io);

            io.emit('update_joined', {status: 200})
            log(`#Joining new room\n socket=${socket}\n room=${message.roomId}`)
        } catch (e) {
            await this.ioEmitError(io, e);
            log('#Joining new room err.: ' + e.message)
        }
    }

    @OnMessage("join_all_room")
    public async joinAllRoom(@SocketIO() io: Server, @ConnectedSocket() socket: Socket, @MessageBody() message: any) {
        try {
            socket.join('all');
            log(`#Joined to Room [all] | Socket [${socket.id}]`)
            socketLogger.joinRoom(socket.id, 'all');
            socketLogger.setRooms(io.sockets.adapter.rooms);
            io.to('all').emit('update_joined', {message: {
                    type: 'join',
                    content: {
                        messageValue: 'joined the chat!',
                        username: socket.id,
                        date: new Date().toTimeString().split(' ')[0],
                    }
                }})
        } catch (e) {
            log('#Joining new room err.: ' + e.message)
            await this.ioEmitError(io, e);
        }
    }

    public async ioEmitError(@SocketIO() io: Server, exception: any) {
        io.emit('room_error', {error: {type: exception.name, message: exception.message}});
    }

    /**
     * Handles the following cleanups when a socket had been disconnected
     * 1. If the socket was searching for partner: remove it from joingPool
     * 2. If the socket was in a room: remove it from the room,
     *  then alert partner that he left
     * @param io
     * @param socket
     * @param message
     */
    @OnMessage("disconnect")
    public async handleDisconnect(@SocketIO() io: Server, @ConnectedSocket() socket: Socket) {
        log(`#Disconnected Cleanup for [${socket.id}]`)
        const socketInfo = socketLogger.getSocket(socket.id);

        if (socketInfo.data.inRoom) {
            log(`Partner left from room: ${socketInfo.data.inRoom}`)

            const response: MessageType = {
                type: 'join',
                content: {
                    messageValue: 'left the chat!',
                    username: socket.id,
                    date: new Date().toTimeString().split(' ')[0],
                }
            }

            io.to(socketInfo.data.inRoom).emit('partner_left', {message: response});
        }

        // if he was searching, remove him from joiningPool
        if (chatData.joiningPool.has(socket.id)) {
            chatData.joiningPool.delete(socket.id);
        }





        socketData.removeSocket(socket.id);
    }
}