import React, {useEffect, useLayoutEffect, useState} from 'react';
import './availableUsers.scss';
import { v4 } from "uuid";
import socketService from "../../services/socketService";

type PropTypes = {

}

export const AvailableUsers: React.FC<PropTypes> = () => {
    const [availableUsers, setAvailableUsers] = useState<String[]>([]);

    useEffect(() => {
        if (!socketService.socket) return;

        console.log('sending request for all users!')
        socketService.socket.emit('get_users_by_room', {roomId: 'all'});
        socketService.socket.on('update_users', (response) => {
            setAvailableUsers([...response.users])
        });

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