import React, {useState} from "react";
import './createRoom.scss';
import socketService from "../../services/socketService";

type Props = {
    handleFilter: any
};

export const CreateRoom: React.FC<Props> = ( {handleFilter}) => {
    const [roomName, setRoomName] = useState<string>('');

    function handleChange(event: any) {
        setRoomName(event.target.value);

        handleFilter(event.target.value);
    }

    function handleNewRoom() {
        if (!roomName) {
            alert('Room name cannot be empty!');
            return;
        }

        if (socketService.socket) {
            socketService.socket.emit('new_room', {roomId: roomName})
        }

        // setRoomName('');
    }

    function handleJoinRoom() {
        console.log('Joining room: ' + roomName)
    }

    return (
        <div id="create-room-wrap">
            <div className="input-group mb-3">
                <input type="text" className="form-control" placeholder="Enter room name" value={roomName}
                       onChange={handleChange}/>
                <div className="flex bg-white button-container">
                    <button className="btn btn-outline-primary m-1" type="button" onClick={handleNewRoom}>New</button>
                    <button className="btn btn-outline-success m-1" type="button" onClick={handleJoinRoom}>Join</button>
                </div>
            </div>
        </div>
    );
};

export default CreateRoom;