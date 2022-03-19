import {ConnectedSocket, OnConnect, SocketController, SocketIO,} from "socket-controllers";
import {Socket, Server} from "socket.io";
import {log} from "../../lib/logger";
import chatData from "../data/chatDataHandler";

@SocketController()
export class MainController {
    @OnConnect()
    public onConnection(@ConnectedSocket() socket: Socket, @SocketIO() io: Server) {
        log("New Socket connected: ", socket.id);

        // chatData.setAdapterRooms(io.sockets.adapter.rooms)
    }
}
