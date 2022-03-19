import {ConnectedSocket, OnConnect, OnDisconnect, SocketController, SocketIO,} from "socket-controllers";
import {log} from "../../lib/logger";
import {Socket, Server} from "socket.io";
import socketData from "../services/socketLoggerService";

@SocketController()
export class MainController {
    @OnConnect()
    public onConnection(@ConnectedSocket() socket: Socket, @SocketIO() io: Server) {
        log(`New Socket connected: ${socket.id}`);
        socketData.log_storeSocket(socket.id);
    }

    @OnDisconnect()
    public onDisconnection(@ConnectedSocket() socket: Socket, @SocketIO() io: Server) {

    }
}
