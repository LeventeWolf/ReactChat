export const userJoinedTheRoomMessage = (username: string) => {
    return {
        message: {
            type: 'join',
            content: {
                messageValue: 'joined the chat!',
                username,
                date: new Date().toTimeString().split(' ')[0],
            }
        }
    }
}

export const userLeftTheRoomMessage = (username: string) => {
    return {
        message: {
            type: 'join',
            content: {
                messageValue: 'left the chat!',
                username,
                date: new Date().toTimeString().split(' ')[0],
            }
        }
    }
}