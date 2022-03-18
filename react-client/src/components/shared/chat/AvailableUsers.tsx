import React, {useEffect, useState} from 'react';
import './availableUsers.scss';
import SocketService from "../../../services/socketService";
import { v4 } from "uuid";

type PropTypes = {

}

export const AvailableUsers: React.FC<PropTypes> = () => {
    const [availableUsers, setAvailableUsers] = useState<String[]>([]);

    useEffect(() => {
        if (SocketService.socket) {
            SocketService.socket.on('join_chat', (response) => {
                setAvailableUsers(response.users)
            });
        }
    }, [SocketService.socket])

    useEffect(() => {
        if (SocketService.socket) {
            SocketService.socket.emit('get_users');
        }
    }, [])


    return (
        <div className="available-users-wrap">
            <h1 className="title">Available Users ({availableUsers.length})</h1>
            <hr />

            <div className="usernames-wrap">
                <ul>
                    {availableUsers.map(username => {
                        return <li key={v4()}>- {username}</li>
                    })}
                </ul>
            </div>

        </div>
    );
};

export default AvailableUsers;