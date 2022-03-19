import {ConnectedSocket, MessageBody, OnMessage, SocketController, SocketIO} from "socket-controllers";
import {Server, Socket} from "socket.io";
import {log} from '../../lib/logger';
import chatData from '../services/chatDataHandler'

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
            io.emit('room_error', {
                error: {
                    type: e.name,
                    message: e.message
                }
            });
        }
    }

    @OnMessage("join_room")
    public async joinRoom(@SocketIO() io: Server, @ConnectedSocket() socket: Socket, @MessageBody() message: any) {
        try {
            chatData.joinRoom(message.roomId, socket.id);
            await this.ioEmitRooms(io);

            io.emit('update_joined', {status: 200})
            log(`#Joining new room\n socket=${socket}\n room=${message.roomId}`)
        } catch (e) {
            io.emit('room_error', {
                error: {
                    type: e.name,
                    message: e.message
                }
            });
            log('#Joining new room err.: ' + e.message)
        }

    }

    @OnMessage("update_rooms")
    public async ioEmitRooms(@SocketIO() io: Server) {
        io.emit('update_rooms', {rooms: chatData.rooms})
    }
}