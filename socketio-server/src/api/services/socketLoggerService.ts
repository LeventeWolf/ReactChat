interface SocketData {
    id: string,
    data: SocketInfo;
}

interface SocketInfo {
    data: {
        inRoom: string | undefined;
        username: string,
    }
}

class SocketLogger {
    public socketsData = new Map<string, SocketInfo>();
    public rooms = new Map<string, Set<string>>();

    log_storeSocket(socketId: string) {
        this.socketsData.set(socketId, {
            data: {
                inRoom: '',
                username: '',
            }
        })
    }

    getSocket(socketId: string) {
        if (!this.socketsData.get(socketId)) return undefined;

        return {
            id: socketId,
            data: this.socketsData.get(socketId).data
        };
    }

    getRoom(socketId: string): string | undefined {
        return this.getSocket(socketId).data.inRoom;
    }

    joinRoom(socketId: string, roomId: string): void {
        const socket = this.getSocket(socketId);

        if (!socket) {
            console.log('[err] socket not found!: ' + socketId)
            return;
        }

        socket.data.inRoom = roomId;
    }

    leaveRoom(socketId: string, roomId: string): void {
        const socket = this.getSocket(socketId);

        if (!socket) {
            console.log('[err] socket not found!: ' + socketId)
            return;
        }

        socket.data.inRoom = '';
    }

    removeSocket(socketId: string): void {
        this.socketsData.delete(socketId);
    }

    setRooms(rooms: Map<string, Set<string>>) {
        this.rooms = rooms;
    }

    getUsername(socketId) {
        return this.getSocket(socketId).data.username;
    }

    setUsername(socketId: string, username: string) {
        const socket = this.getSocket(socketId);
        socket.data.username = username;
    }

}


export default new SocketLogger();
