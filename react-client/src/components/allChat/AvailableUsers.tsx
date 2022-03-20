import React, {useEffect, useState} from 'react';
import './availableUsers.scss';
import { v4 } from "uuid";
import socketService from "../../services/socketService";


export const AvailableUsers: React.FC = () => {
    const [availableUsers, setAvailableUsers] = useState<String[]>([]);

    useEffect(() => {
        if (!socketService.socket) return;

        socketService.socket.on('update_users', (response) => {setAvailableUsers([...response.users])});
        
        return () => {
            if (!socketService.socket) return;

            socketService.socket.off('update_users');
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