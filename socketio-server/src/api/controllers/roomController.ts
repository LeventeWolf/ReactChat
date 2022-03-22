import {ConnectedSocket, MessageBody, OnMessage, SocketController, SocketIO} from "socket-controllers";
import {Server, Socket} from "socket.io";
import {log, logt} from '../../lib/logger';
import roomService from '../services/roomService'
import socketLogger from "../services/socketLoggerService";
import {ioEmitChatMessageToRoom} from "./chatController";
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
        log(`Socket joined to room: '${message.roomId}' | ${socket.id}`)

        // Update RoomService Info
        roomService.joinRoom(roomId, socket.id)

        // Update SocketLogger Info
        socketLogger.updateSocketInRoom(socket.id, message.roomId);
        socketLogger.updateRooms(io.sockets.adapter.rooms);
        socketLogger.updateUsername(socket.id, message.username);

        // Update rooms
        this.ioEmitUpdateRooms(io);
    }

    @OnMessage("new_room")
    public async createNewRoom(@SocketIO() io: Server, @ConnectedSocket() socket: Socket, @MessageBody() message: any) {
        try {
            log(`#Creating new room: id=${message.roomId}`)
            roomService.createNewRoom(message.roomId)
            await this.ioEmitUpdateRooms(io);
        } catch (e) {
            await ioEmitRoomError(io, e);
            log('#Joining new room err.: ' + e.message)
        }
    }

    @OnMessage("update_rooms")
    public async ioEmitUpdateRooms(@SocketIO() io: Server) {
        log(`[RoomController] Emitting: 'update_rooms'`)
        Object.entries(roomService.rooms).forEach(entry => {
            logt(`${entry[0]} - ${JSON.stringify(entry[1])}`);
        })
        io.emit('update_rooms', {rooms: roomService.rooms})
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
            if (roomService.joiningPool.has(socket.id)) {
                logt(`CleanUp: Remove from searching users: ${socket.id}`)
                roomService.joiningPool.delete(socket.id);
            }
        }

        // Cleanup
        // await emitLeftTheRoomMessage();
        await deleteFromSearchingPool();

        // Update RoomsService Info
        roomService.leaveRoom(socketInfo.id, socketInfo.data.inRoom)
        await this.ioEmitUpdateRooms(io);

        // Update SocketLogger
        socketLogger.removeSocket(socket.id);

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