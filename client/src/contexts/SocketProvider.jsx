import React from 'react'
import io from 'socket.io-client'

const SocketContext = React.createContext()

export function useSocket() {
    return React.useContext(SocketContext)
}

export default function SocketProvider({ user, children }) {

    const [socket, setSocket] = React.useState(null)

    React.useEffect(() => {
        const newSocket = io('http://localhost:5000')
        setSocket(newSocket)
        if (user && newSocket) {
            newSocket.emit('addUser', user)
        }
        return () => newSocket.close()
    }, [user])


    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}