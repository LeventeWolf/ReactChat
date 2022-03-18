import Chat from "../shared/chat/Chat";
import EnterUsername from "../shared/chat/EnterUsername";
import MessageBox from "../shared/chat/MessageBox";
import AvailableUsers from "./AvailableUsers";
import React, {useState} from "react";

export const AllChat = () => {
    const [username, setUsername] = useState('');
    const [isJoined, setIsJoined] = useState(false)

    return (
        <Chat>
            {!isJoined ?
                <EnterUsername setUsername={setUsername} setIsJoined={setIsJoined}/>
                :
                <MessageBox username={username}/>
            }
            <AvailableUsers />
        </Chat>
    );
}

export default AllChat;