import {ConnectedSocket, OnConnect, OnDisconnect, SocketController, SocketIO,} from "socket-controllers";
import {Socket, Server} from "socket.io";
import {log} from "../../lib/logger";
import chatData from "../data/chatDataHandler";

@SocketController()
export class MainController {
    @OnConnect()
    public onConnection(@ConnectedSocket() socket: Socket, @SocketIO() io: Server) {
        log("New Socket connected: "+ socket.id);

        chatData.allSockets.add(socket.id);
    }

    @OnDisconnect()
    public onDisconnection(@ConnectedSocket() socket: Socket, @SocketIO() io: Server) {
        chatData.allSockets.delete(socket.id);
    }
}
