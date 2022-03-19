import {ConnectedSocket, MessageBody, OnDisconnect, OnMessage, SocketController, SocketIO} from "socket-controllers";
import { Server, Socket } from "socket.io";
import chatData from '../services/chatDataHandler'
import {log} from "../../lib/logger";

export interface MessageType {
    type: 'join' | 'message';
    content: {
        username: string,
        messageValue: string,
        date: string,
    }
}

@SocketController()
export class ChatController {

    @OnMessage("chat_message")
    public async updateRooms(@SocketIO() io: Server, @ConnectedSocket() socket: Socket, @MessageBody() message: any) {
        Array.from(socket.rooms).forEach(room => {
            const roomSize = io.sockets.adapter.rooms.get(room).size;
            if (roomSize !== 2) return

            io.to(room).emit('chat_message', {message});
        })
    }

    @OnDisconnect()
    public async disconnect(@SocketIO() io: Server, @ConnectedSocket() socket: any) {
        log('Disconnected socket ' + socket.id)
    }
}
