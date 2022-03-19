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
        log(`Joining random room: ${socket.id}`);

        chatData.joiningPool.add(socket.id);

        try {
            const connectedSockets = io.sockets.adapter.rooms;

            log('-- Available Rooms --')
            Array.from(connectedSockets).forEach((dict, index) => {
                const key = dict[0];
                const sockets = dict[1];

                if (chatData.joiningPool.has(key) && socket.id !== dict[0] && sockets.size < 2) {
                    socket.join(key);
                    io.to(key).emit('partner_found');

                    console.log(`${socket.id} joined to room: ${key}`)
                    console.log(`${index}. ${key} -`, Array.from(sockets).map(value => value));
                    sockets.forEach(socketId => {
                        chatData.joiningPool.delete(socketId);
                    })
                    return;
                }
            })


            console.log()

            // console.log(`available rooms:`);
            // socketRooms.forEach(room => {
            //     console.log(` ${room}`)
            // });
        } catch (e) {
            console.log(e)
        }

        // const socketRooms = Array.from(connectedSockets.values()).filter((r) => r !== socket.id);
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
    @OnMessage("disconnect")
    public async handleDisconnect(@SocketIO() io: Server, @ConnectedSocket() socket: Socket) {
        // TODO if socket was in room, emit user that he left


        // if he was searching, remove him from joiningPool
        if (chatData.joiningPool.has(socket.id)) {
            chatData.joiningPool.delete(socket.id);
        }
    }

}