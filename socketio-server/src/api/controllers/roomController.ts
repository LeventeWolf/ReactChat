import {ConnectedSocket, MessageBody, OnMessage, SocketController, SocketIO} from "socket-controllers";
import {Server, Socket} from "socket.io";
import {log, logt} from '../../lib/logger';
import chatData from '../services/chatDataHandler'
import socketLogger from "../services/socketLoggerService";
import {ioEmitChatMessageToRoom} from "./chatController";
import socketData from "../services/socketLoggerService";
import {userJoinedTheRoomMessage, userLeftTheRoomMessage} from "../constants/chatMessageConstants";

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
            // Join room
            this.joinToRoom(io, socket, message);

            // Emit message: '<username> joined the chat'
            await ioEmitChatMessageToRoom(io, message.roomId, userJoinedTheRoomMessage(message.username));

            // Emit <username> to <AvailableUsers /> component
            await ioEmitUsersToRoom(io, message.roomId)
        } catch (e) {
            log('#Joining new room err.: ' + e.message)
            await ioEmitError(io, e);
        }
    }

    private joinToRoom(io: Server, socket: Socket, message: any) {
        // Join to io.sockets.adapter.rooms
        socket.join(message.roomId);

        // Update logger
        socketLogger.updateSocketInRoom(socket.id, message.roomId);
        socketLogger.updateRooms(io.sockets.adapter.rooms);
        socketLogger.updateUsername(socket.id, message.username);
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
    public async cleanUp(@SocketIO() io: Server, @ConnectedSocket() socket: Socket) {
        log(`Disconnect cleanup for [${socket.id}]`)
        const socketInfo = socketLogger.getSocket(socket.id);

        // Alert other users that user left!
        const cleanUpIfJoinedRoom = async () => {
            logt(`1. CleanUp: If user was in a room!`)
            if (socketInfo.data.inRoom) {
                logt(` + Emit 'user left' message to room: '${socketInfo.data.inRoom}'`)
                await ioEmitChatMessageToRoom(io, socketInfo.data.inRoom, userLeftTheRoomMessage(socketInfo.data.username))
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
}

/**
 * Update <AvailableUsers /> users when a user is joined to the chat
 * @param io
 * @param roomId
 * @private
 */
async function ioEmitUsersToRoom(io: Server, roomId: string) {
    try {
        const sockets = Array.from(io.sockets.adapter.rooms.get(roomId).values());
        const users = sockets.map(socketId => socketLogger.getUsername(socketId));
        io.to(roomId).emit('update_users', {users});
        logt(`Room updated: '${roomId}'`)
        logt(`Room users  : [${users}]`)
    } catch (e) {
        logt(e)
        await ioEmitError(io, e);
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