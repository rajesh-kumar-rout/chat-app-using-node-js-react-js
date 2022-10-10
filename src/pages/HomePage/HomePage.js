import { useContext, useEffect, useState } from "react"
import { CLIENT_ERROR, SERVER_ERROR } from "../../utils/constants"
import useRequest from "../../hooks/useRequest"
import User from "../../components/User/User"
import { MdSearch } from "react-icons/md"
import styles from "./HomePage.module.css"
import { SocketContext } from "../../App"
import { AccountContext } from "../../components/Account"
import Loader from "../../components/Loader/Loader"

export default function HomePage() {
    const request = useRequest()
    const [users, setUsers] = useState([])
    const [query, setQuery] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const filteredUsers = users.filter(user => user.name.toLowerCase().includes(query.toLowerCase()))
    const { socket } = useContext(SocketContext)
    const { account } = useContext(AccountContext)

    useEffect(() => {
        socket.on("messages", (message) => {
            if (message.receiverId === account.id && users[0].id !== message.senderId) {
                setUsers([
                    users.find(user => user.id === message.senderId),
                    ...users.filter(user => user.id !== message.senderId)
                ])
            } else if (message.senderId === account.id && users[0].id !== message.receiverId) {
                setUsers([
                    users.find(user => user.id === message.receiverId),
                    ...users.filter(user => user.id !== message.receiverId)
                ])
            }
        })

        return () => socket.off("messages")
    }, [users])

    const fetchUsers = async () => {
        setIsLoading(true)
        try {
            const response = await request("/users")
            if (response.status === 200) {
                setUsers(await response.json())
            } else {
                alert(SERVER_ERROR)
            }
        } catch {
            alert(CLIENT_ERROR)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <MdSearch size={24} />
                <input 
                    type="search" 
                    value={query} 
                    onChange={e => setQuery(e.target.value)} 
                    placeholder="Search users..." 
                    autoFocus 
                />
            </div>

            <div className={styles.body}>
                {isLoading && <Loader/>}
                {filteredUsers.map(user => <User user={user} />)}
            </div>
        </div>
    )
}