import React, {useEffect, useState} from 'react';

import styled from "styled-components";
import SocketService from "../../services/socketService";

const Main = styled.div`
  margin-top: 80px;
  height: 100%;
`

const Title = styled.h1`
  width: 100%;
  text-align: center;
  color: #8e44ad;
`;

const RoomContainer = styled.div`
  width: 700px;
  margin: 0 auto;
  box-shadow: 0 1px 2px 0 black;
  padding: 10px 10px;


  display: flex;
  flex-direction: column;
  gap: 10px;

`;

const RoomWrap = styled.div`
  width: 100%;
  background-color: rgba(70, 118, 198, 0.12);
  padding: 10px;
  
  border-radius: 10px;
`;

type RoomType = {
    id: string
}

export const Room: React.FC<RoomType> = ({id}) => {
    return (
        <RoomWrap>
            {id}
        </RoomWrap>
    );
}

function Rooms() {
    const [rooms, setRooms] = useState<String[]>([]);

    // if (SocketService.socket) {
    //     SocketService.socket.on('all_rooms', (message) => {
    //         console.log('all_rooms!: ', message.rooms)
    //         setRooms(message.rooms);
    //     })
    // }

    useEffect(() => {
        if (SocketService.socket) {
            SocketService.socket.emit('get_all_rooms');
            SocketService.socket.on('all_rooms', (message) => {
                console.log('all_rooms!: ', message.rooms)
                setRooms(message.rooms);
            })
            return;
        }
    }, []);


    return (
        <Main>
            <Title>Rooms</Title>
            <RoomContainer>
                {rooms?.map((name: any) => {return <Room key={name} id={name} />})}
            </RoomContainer>
        </Main>
    );
}

export default Rooms;