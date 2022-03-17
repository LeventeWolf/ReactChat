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
        const room: Room = {
            id: message.roomId,
            users: [],
            capacity: 1000,
            visibility: 'public',
        }

        if (chatData.rooms.map(room => room.id).includes(room.id)) {
            console.log(`Room with id="${room.id}" already exists!`)
            return;
        }

        chatData.rooms.unshift(room);

        log('emitting update!')
        io.emit('update_rooms', {rooms: chatData.rooms})
    }


    @OnMessage("get_rooms")
    public async getRooms(@SocketIO() io: Server, @ConnectedSocket() socket: Socket, @MessageBody() message: any) {
        io.emit('update_rooms', {rooms: chatData.rooms})
    }
}
