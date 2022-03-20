import {ConnectedSocket, MessageBody, OnMessage, SocketController, SocketIO} from "socket-controllers";
import {Server, Socket} from "socket.io";
import {log, logt} from "../../lib/logger";
import chatData from "../services/chatDataHandler";
import {ioEmitError} from "./roomController";

@SocketController()
export class RoomCreatorController {
    @OnMessage("new_room")
    public async createNewRoom(@SocketIO() io: Server, @ConnectedSocket() socket: Socket, @MessageBody() message: any) {
        try {
            log(`#Creating new room: id=${message.roomId}`)
            chatData.createNewRoom(message.roomId)
            await this.ioEmitRoomNames(io);
        } catch (e) {
            await ioEmitError(io, e);
            log('#Joining new room err.: ' + e.message)
        }
    }

    @OnMessage("update_rooms")
    public async ioEmitRoomNames(@SocketIO() io: Server) {
        io.emit('update_rooms', {rooms: chatData.rooms})
    }
}
