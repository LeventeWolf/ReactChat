import {ConnectedSocket, MessageBody, OnMessage, SocketController, SocketIO} from "socket-controllers";
import {Server, Socket} from "socket.io";
import {log, logt} from '../../lib/logger';
import chatData from '../services/chatDataHandler'
import socketLogger from "../services/socketLoggerService";
import {ioEmitChatMessageToRoom} from "./chatController";
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
    @OnMessage("join_room")
    public async joinRoom(@SocketIO() io: Server, @ConnectedSocket() socket: Socket, @MessageBody() message: any) {
        console.log();
        log(`Socket joined to room: '${message.roomId}' | ${socket.id}`)

        try {
            socket.join(message.roomId);
            socketLogger.joinRoom(socket.id, message.roomId);
            socketLogger.setRooms(io.sockets.adapter.rooms);
            socketLogger.setUsername(socket.id, message.username);

            // Show other users a message: new user joined
            await ioEmitChatMessageToRoom(io, message.roomId, this.userJoinedThRoomMessage(message.username));

            // Updating AvailableUsers
            await this.ioEmitUsersToRoom(io, message.roomId)
        } catch (e) {
            log('#Joining new room err.: ' + e.message)
            await ioEmitError(io, e);
        }
    }

    /**
     * Update <AvailableUsers /> users when a user is joined to the chat
     * @param io
     * @param roomId
     * @private
     */
    private async ioEmitUsersToRoom(io: Server, roomId: string) {
        try {
            if (!io.sockets.adapter.rooms.get(roomId)) {
                logt(`all not created yet, sending back []`)
                io.to(roomId).emit('update_users', {users: []});
                return;
            }

            const sockets = Array.from(io.sockets.adapter.rooms.get(roomId).values());
            const users = sockets.map(socketId => socketLogger.getUsername(socketId));
            await this.updateRoomUsers(io, roomId, users);
        } catch (e) {
            logt(e)
            await ioEmitError(io, e);
        }
    }

    private async updateRoomUsers(@SocketIO() io: Server, roomId: string, users: string[]) {
        io.to(roomId).emit('update_users', {users});
        logt(`Room updated: '${roomId}'`)
        logt(`Room users  : [${users}]`)
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
        log(`Disconnect cleanup for [${socket.id}]`)
        const socketInfo = socketLogger.getSocket(socket.id);

        // Alert other users that user left!
        const cleanUpIfJoinedRoom = async () => {
            logt(`1. CleanUp: If user was in a room!`)
            if (socketInfo.data.inRoom) {
                logt(` + Emit 'user left' message to room: '${socketInfo.data.inRoom}'`)
                await ioEmitChatMessageToRoom(io, socketInfo.data.inRoom, this.userLeftTheRoomMessage(socketInfo.data.username))
            }
        };

        // if he was searching, remove him from joiningPool
        function cleanUpSearchingForPartner() {
            logt(`2. CleanUp: If user was searching!`)
            if (chatData.joiningPool.has(socket.id)) {
                logt(` + Deleted from searching user: ${socket.id}`)
                chatData.joiningPool.delete(socket.id);
            }
        }

        // Cleanup
        await cleanUpIfJoinedRoom();
        cleanUpSearchingForPartner();
        socketData.removeSocket(socket.id);
        console.log()
    }


    // Messages
    private userJoinedThRoomMessage = (username: string) => {
        return {
            message: {
                type: 'join',
                content: {
                    messageValue: 'joined the chat!',
                    username,
                    date: new Date().toTimeString().split(' ')[0],
                }
            }
        }
    }

    private userLeftTheRoomMessage = (username: string) => {
        return {
            message: {
                type: 'join',
                content: {
                    messageValue: 'left the chat!',
                    username,
                    date: new Date().toTimeString().split(' ')[0],
                }
            }
        }
    }
}


/**
 * Emit possible errors <br>
 * ev: 'room_error'
 * @param io
 * @param exception
 */
export async function ioEmitError(io: Server, exception: any) {
    io.emit('room_error', {
        error: {
            type: exception.name
            , message: exception.message
        }
    });
}