import React, {useContext} from "react";
import styled from "styled-components";
import socketService from "../../services/socketService";
import chatContext from "./chatContext";

const JoinRoomContainer = styled.div`
  margin: 5rem auto;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const JoinButton = styled.button`
  outline: none;
  background-color: #8e44ad;
  color: #fff;
  font-size: 17px;
  border: 2px solid transparent;
  border-radius: 5px;
  padding: 4px 18px;
  transition: all 230ms ease-in-out;
  cursor: pointer;

  margin-top: 1rem;
  width: 10em;

  &:hover {
    background-color: transparent;
    border: 2px solid #8e44ad;
    color: #8e44ad;
  }
`;

export const JoinRoom = () => {
    const {isJoining, setIsJoining} = useContext(chatContext);

    function handleJoin() {
        setIsJoining(true);

        if (socketService.socket) {
            socketService.socket.emit('join_random_room');
        }
    }

    if (isJoining) {
        return (
            <JoinRoomContainer>
                <div>Looking for a partner...</div>
                <div style={{textAlign: 'center'}}>be patient:)</div>
            </JoinRoomContainer>
        )
    }

    return (
        <JoinRoomContainer>
            <h4>Chat with a stranger!</h4>
            <JoinButton type="submit" onClick={handleJoin}>
                Find a partner
            </JoinButton>
        </JoinRoomContainer>
    );
}
