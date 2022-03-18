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

function delay(delayInms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(2);
        }, delayInms);
    });
}

@SocketController()
export class RandomPartnerController {

    @OnMessage("join_random_room")
    public async joinRandomRoom(@SocketIO() io: Server, @ConnectedSocket() socket: Socket, @MessageBody() message: any) {
        try {
            chatData.joinRandomRoom(socket.id);
            await delay(1000);
            io.emit('partner_found');
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
}