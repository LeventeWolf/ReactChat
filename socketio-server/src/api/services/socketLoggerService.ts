interface SocketData {
    id: string,
    data: SocketInfo;
}

interface SocketInfo {
    data: {
        inRoom: string | undefined;
    }
}

class SocketLogger {
    public socketsData = new Map<string, SocketInfo>();

    log_storeSocket(socketId: string) {
        this.socketsData.set(socketId, {
            data: {
                inRoom: '',
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
}


export default new SocketLogger();
