import {ConnectedSocket, MessageBody, OnMessage, SocketController, SocketIO} from "socket-controllers";
import {Server, Socket} from "socket.io";
import {log, logt} from '../../lib/logger';
import chatData from '../services/chatDataHandler'
import socketLogger from "../services/socketLoggerService";
import {ioEmitChatMessageToRoom} from "./chatController";
import socketData from "../services/socketLoggerService";
import {userJoinedTheRoomMessage, userLeftTheRoomMessage} from "../constants/chatMessageConstants";
import {ioEmitAvailableUsers} from "./availableUsersController";

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
            // Socket join to specified room
            this.joinToRoom(io, socket, message.roomId, message);

            // Emit message: '<username> joined the chat'
            await ioEmitChatMessageToRoom(io, message.roomId, userJoinedTheRoomMessage(message.username));

            // Emit <username> to <AvailableUsers /> component
            await ioEmitAvailableUsers(io, message.roomId)
        } catch (e) {
            log('#Joining new room err.: ' + e.message)
            await ioEmitRoomError(io, e);
        }
    }

    private joinToRoom(io: Server, socket: Socket, roomId: string, message: any) {
        // Join to io.sockets.adapter.rooms
        socket.join(roomId);

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
        log(`Disconnect cleanup | ${socket.id}`)
        const socketInfo = socketLogger.getSocket(socket.id);

        // Emit message '<username> left the room'!
        // const emitLeftTheRoomMessage = async () => {
        //     if (socketInfo.data.inRoom) {
        //         logt(`CleanUp: Emit 'user left' message to room: '${socketInfo.data.inRoom}'`)
        //         await ioEmitChatMessageToRoom(io, socketInfo.data.inRoom, userLeftTheRoomMessage(socketInfo.data.username))
        //     }
        // };

        // TODO Extract to searchController
        // if he was searching, remove him from searching pool
        const deleteFromSearchingPool = async () => {
            if (chatData.joiningPool.has(socket.id)) {
                logt(`CleanUp: Remove from searching users: ${socket.id}`)
                chatData.joiningPool.delete(socket.id);
            }
        }

        // Cleanup
        // await emitLeftTheRoomMessage();
        await deleteFromSearchingPool();
        socketData.removeSocket(socket.id);
        console.log()
    }
}


/**
 * Emit possible errors <br>
 * ev: 'room_error'
 * @param io
 * @param exception
 */
export async function ioEmitRoomError(io: Server, exception: any) {
    io.emit('room_error', {
        error: {
            type: exception.name,
            message: exception.message
        }
    });
}