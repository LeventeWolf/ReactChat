import React from "react";

export interface ChatContextProps {
    isInRoom: boolean;
    setInRoom: (inRoom: boolean) => void;
    isJoining: boolean;
    setIsJoining: (isJoining: boolean) => void;
    partnerLeft: boolean,
    setPartnerLeft: (partnerLeft: boolean) => void;
    roomId: string,
    setRoomId: (roomId: string) => void;
}

const defaultState: ChatContextProps = {
    isInRoom: false,
    setInRoom: () => {},
    isJoining: false,
    setIsJoining: () => {},
    partnerLeft: false,
    setPartnerLeft: () => {},
    roomId: '',
    setRoomId: () => {},
};

export default React.createContext(defaultState);
