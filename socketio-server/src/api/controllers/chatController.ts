import {ConnectedSocket, MessageBody, OnDisconnect, OnMessage, SocketController, SocketIO} from "socket-controllers";
import { Server, Socket } from "socket.io";

export interface MessageType {
    type: 'join' | 'message';
    content: {
        username: string,
        messageValue: string,
        date: string,
    }
}

@SocketController()
export class ChatController {
    private messages: MessageType[] = [];
    private users = [{id: 'socket_id_12345', username: 'Big Brother 👀'}];

    @OnMessage("join_chat")
    public async joinChat(@SocketIO() io: Server, @ConnectedSocket() socket: Socket, @MessageBody() message: any) {
        if (!message.username) return;

        console.log(message.username + ' joined the chat!');

        this.users.push({id: socket.id, username: message.username});
        io.emit('join_chat', {users: this.users.map( user => user.username )});
    }

    @OnMessage("get_users")
    public async getUsers(@SocketIO() io: Server, @ConnectedSocket() socket: Socket, @MessageBody() message: any) {
        io.emit('join_chat', {users: this.users.map( user => user.username )});
    }

    @OnMessage("leave_chat")
    public async leaveChat(@SocketIO() io: Server, @ConnectedSocket() socket: Socket) {
        const user = this.users.find(u => u.id === socket.id);
        if (user === undefined) return;

        console.log(user.username + ' disconnected');
        this.users = this.users.filter(u => u.id !== user.id && u.username !== user.username);

        // Remove user from available users
        io.emit('join_chat', {users: this.users.map(user => user.username)});

        // Send chat message '{username} left the chat'
        const messageData: MessageType = {type: 'join', content: {messageValue: 'left the chat!', username: user.username, date: new Date().toTimeString().split(' ')[0],}}
        this.messages.unshift(messageData);
        io.emit('chat_message', {messages: this.messages})
    }

    @OnDisconnect()
    public async disconnect(@SocketIO() io: Server, @ConnectedSocket() socket: any) {
        await this.leaveChat(io, socket);
    }

    @OnMessage("chat_message")
    public async updateRooms(@SocketIO() io: Server, @ConnectedSocket() socket: Socket, @MessageBody() message: any) {
        if (message) {
            this.messages.unshift(message);
        }

        io.emit('chat_message', {messages: this.messages});
    }
}
