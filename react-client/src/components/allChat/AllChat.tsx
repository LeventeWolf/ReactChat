import Chat from "../shared/chat/Chat";
import EnterUsername from "./EnterUsername";
import AvailableUsers from "./AvailableUsers";
import React, {useState} from "react";
import AllChatMessageBox from "./AllChatMessageBox";

export const AllChat = () => {
    const [username, setUsername] = useState('');
    const [isJoined, setIsJoined] = useState(false)

    return (
        <Chat>
            {!isJoined ?
                <EnterUsername setUsername={setUsername} setIsJoined={setIsJoined}/>
                :
                <>
                    <AllChatMessageBox username={username}/>
                    <AvailableUsers />
                </>
            }
        </Chat>
    );
}

export default AllChat;