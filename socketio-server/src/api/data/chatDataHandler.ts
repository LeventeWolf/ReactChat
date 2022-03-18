import {MessageType} from "../controllers/chatController";


class ChatData {
    public messages: MessageType[] = [];
    public users = [{id: 'socket_id_12345', username: 'Big Brother 👀'}];
    public rooms = {}

    getUserBySocket(socketId) {
        return this.users.find(user => user.id === socketId);
    }

    createNewRoom(roomId: string, capacity=1000) {
        if (this.rooms[roomId]) {
            throw {
                name: 'room_exists_error',
                message: 'room already exists'
            }
        }

        this.rooms[roomId] = {
            sockets: [],
            messages: [],
            capacity: 1000,
            visibility: 'public',
        };
    }

    joinRoom(roomId: string, socket: string) {
        if (!this.rooms[roomId]) {
            throw {
                name: 'room_not_exists',
                message: 'room not exists! ' + roomId
            };
        }
        if (this.rooms[roomId].sockets.includes(socket)) {
            throw {
                name: 'already_in_room_error',
                message: 'You are already in this room! ' + roomId + ' ' + socket
            };
        }

        this.rooms[roomId].sockets.push(socket);
    }

    joinRandomRoom(roomId: string, socketId: string) {
        this.createNewRoom(roomId)
    }
}


export default new ChatData();
