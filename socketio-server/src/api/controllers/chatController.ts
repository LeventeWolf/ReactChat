import {ConnectedSocket, MessageBody, OnDisconnect, OnMessage, SocketController, SocketIO} from "socket-controllers";
import { Server, Socket } from "socket.io";
import chatData from '../services/roomService'
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
    public async ioEmitMessageToRooms(@SocketIO() io: Server, @ConnectedSocket() socket: Socket, @MessageBody() message: any) {
        // Send message to all rooms, except: personal room where user is alone
        Array.from(socket.rooms).forEach(roomId => {
            const adapter_room = io.sockets.adapter.rooms.get(roomId);
            if (roomId === socket.id && adapter_room.size === 1) return;
            ioEmitChatMessageToRoom(io, roomId, {message});
        })
    }
}

export async function ioEmitChatMessageToRoom(io: Server, roomId: string, message: any) {
    io.to(roomId).emit('chat_message', message)
}