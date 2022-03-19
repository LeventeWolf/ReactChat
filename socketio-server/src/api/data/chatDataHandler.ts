import {MessageType} from "../controllers/chatController";
import {Socket} from "socket.io";


class ChatData {
    public messages: MessageType[] = [];
    public users = [{id: 'socket_id_12345', username: 'Big Brother 👀', isInRoom: true}];
    public rooms = {}
    public joiningAdapterRooms = new Map();
    public joiningPool = new Set();
    public allSockets = new Set();


    getUserBySocket(socketId) {
        return this.users.find(user => user.id === socketId);
    }

    createNewRoom(roomId: string, capacity=1000, visibility='public') {
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
            visibility,
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

    setAdapterRooms(rooms) {
        this.joiningAdapterRooms = rooms;
    }

    // joinRandomRoom(io: Socket, socketId: string) {
    //     this.createNewRoom(socketId, 2, 'private');
    // }
}


export default new ChatData();
