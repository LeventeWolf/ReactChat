import {MessageType} from "../controllers/chatController";


class ChatData {
    public messages: MessageType[] = [];
    public users = [{id: 'socket_id_12345', username: 'Big Brother 👀'}];
    public rooms = {}

    getUserBySocket(socketId) {
        return this.users.find(user => user.id === socketId);
    }
}


export default new ChatData();
