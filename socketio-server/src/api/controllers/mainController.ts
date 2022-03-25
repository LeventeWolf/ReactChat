import {ConnectedSocket, OnConnect, OnDisconnect, SocketController, SocketIO,} from "socket-controllers";
import {log} from "../../lib/logger";
import {Socket, Server} from "socket.io";
import socketLogger from "../services/socketLoggerService";

@SocketController()
export class MainController {
    @OnConnect()
    public onConnection(@ConnectedSocket() socket: Socket, @SocketIO() io: Server) {
        log(`[MainController] New Socket connected: ${socket.id}`);
        socketLogger.log_storeSocket(socket.id);
        socketLogger.updateRooms(io.sockets.adapter.rooms);
    }

    @OnDisconnect()
    public async disconnect(@SocketIO() io: Server, @ConnectedSocket() socket: any) {
        log(`[MainController] Disconnected socket ${socket.id}`)
    }
}
