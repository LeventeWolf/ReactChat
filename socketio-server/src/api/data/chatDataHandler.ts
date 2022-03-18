import {MessageType} from "../controllers/chatController";


class ChatData {
    public messages: MessageType[] = [];
    public users = [{id: 'socket_id_12345', username: 'Big Brother 👀'}];
    public rooms = {}

    getUserBySocket(socketId) {
        return this.users.find(user => user.id === socketId);
    }

    createNewRoom(roomId: string) {
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

}


export default new ChatData();
