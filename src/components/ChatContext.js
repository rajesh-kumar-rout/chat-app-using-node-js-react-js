import { createContext, useState } from "react"
import { Outlet } from "react-router-dom"

const ChatContext = createContext()

export default function ChatContext() {
    const [users, setUsers] = useState([])
    const [messages, setMessages] = useState([])

    useEffect(() => {
        socket.on("messages", (message) => {
            if (message.receiverId === account.id && users[0].id !== message.senderId) {
                setUsers([
                    users.find(user => user.id === message.senderId),
                    ...users.filter(user => user.id !== message.senderId)
                ])
                setMessages([
                    ...messages,
                    message
                ])
            } else if (message.senderId === account.id && users[0].id !== message.receiverId) {
                setUsers([
                    users.find(user => user.id === message.receiverId),
                    ...users.filter(user => user.id !== message.receiverId)
                ])
                setMessages([
                    ...messages,
                    message
                ])
            }
        })

        return () => {
            socket.off("messages")
        }
    }, [users, messages])

    return (
        <ChatContext.Provider
            value={{
                users,
                setUsers,
                message,
                setMessage
            }}
        >
            <Outlet/>
        </ChatContext.Provider>
    )
}