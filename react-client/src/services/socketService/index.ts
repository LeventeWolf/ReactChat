import {io, Socket} from "socket.io-client";
// @ts-ignore
import {DefaultEventsMap} from "socket.io-client/build/typed-events";
import config from "../../shared/config";

class SocketService {
    public socket: Socket | null = null;

    public connect(url: string): Promise<Socket<DefaultEventsMap, DefaultEventsMap>> {
        return new Promise((rs, rj) => {
            this.socket = io(url);

            if (!this.socket) {
                console.log(rj);
                return rj();
            }

            this.socket.on("connect", () => {
                console.log(`Connected to ${config.socketIoServerUrl}`)
                rs(this.socket as Socket);
                if (this.socket) {
                    console.log('Client id: ' + this.socket.id);
                }
            });

            this.socket.on("connect_error", (err) => {
                console.log(err)
                console.log('socket-io connection lost!')
            });
        });
    }
}

export default new SocketService();
