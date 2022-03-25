import {MessageType} from "../controllers/chatController";
import {log, logt} from "../../lib/logger";

type RoomInfo = {
    sockets: string[],
    messages: string[],
    capacity: number,
    visibility: "public" | "private"
}

class RoomsService {
    public rooms: { [id: string]: RoomInfo } = {}
    public messages: MessageType[] = [];
    public users = [{id: 'socket_id_12345', username: 'Big Brother 👀', isInRoom: true}];
    public joiningAdapterRooms = new Map();
    public joiningPool = new Set();

    createNewRoom(roomId: string, capacity=1000, visibility: ("public" | "private") = "public") {
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

    leaveRoom(socketId: string, roomId: string) {
        if (!roomId) throw Error;

        logt(`[RoomService] before remove: ${JSON.stringify(this.rooms[roomId].sockets)}`)
        this.rooms[roomId].sockets = this.rooms[roomId].sockets.filter(sId => sId !== socketId);
        log(`[RoomService] Removed socket from room: ${roomId} | ${socketId}`)
        logt(`[RoomService] after remove: ${JSON.stringify(this.rooms[roomId].sockets)}`)

    }
}


export default new RoomsService();
