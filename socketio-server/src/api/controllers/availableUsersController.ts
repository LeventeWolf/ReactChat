import {ConnectedSocket, OnMessage, SocketController, SocketIO} from "socket-controllers";
import {Server, Socket} from "socket.io";
import {log, logt} from '../../lib/logger';
import socketLogger from "../services/socketLoggerService";
import {ioEmitRoomError} from "./roomController";


@SocketController()
export class AvailableUsersController {

    @OnMessage("disconnect")
    public async removeUserFromAvailableUsers(@SocketIO() io: Server, @ConnectedSocket() socket: Socket) {
        const socketInfo = socketLogger.getSocket(socket.id);

        if (socketInfo.data.inRoom) {
            logt(`Removing user from availableUsers!`);
            await ioEmitAvailableUsers(io, socketInfo.data.inRoom);
        }
    }
}


/**
 * Update <AvailableUsers /> users when a user is joined to the chat
 * @param io
 * @param roomId
 * @private
 */
export async function ioEmitAvailableUsers(io: Server, roomId: string) {
    try {
        const sockets = Array.from(io.sockets.adapter.rooms.get(roomId).values());
        const users = sockets.map(socketId => socketLogger.getUsername(socketId));
        io.to(roomId).emit('update_users', {users});
        logt(` + Room updated: '${roomId}'`)
        logt(` + Room users  : [${users}]`)
    } catch (e) {
        logt(e)
        await ioEmitRoomError(io, e);
    }
}