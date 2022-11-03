import { useContext, useEffect, useState } from "react"
import { SocketContext } from "../../App"
import { AccountContext } from "../../components/Account"
import { MdSearch } from "react-icons/md"
import useRequest from "../../hooks/useRequest"
import User from "../../components/User/User"
import styles from "./HomePage.module.css"
import Loader from "../../components/Loader/Loader"

export default function HomePage() {
    const request = useRequest()
    const [users, setUsers] = useState([])
    const [query, setQuery] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const filteredUsers = users.filter(user => user.name.toLowerCase().includes(query.toLowerCase()))
    const { socket } = useContext(SocketContext)
    const { account } = useContext(AccountContext)

    const fetchUsers = async () => {
        setIsLoading(true)
        const { status } = await request("/users")
        setUsers(await response.json())
        setIsLoading(false)
    }


    useEffect(() => {
        socket.on("messages", (message) => {
            if (message.receiverId === account.id) {
                setUsers([
                    {
                        ...users.find(user => user.id === message.senderId),
                        message: message.message
                    },
                    ...users.filter(user => user.id !== message.senderId)
                ])
            }
        })

        return () => socket.off("messages")
    }, [users])

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
                />
            </div>

            <div className={styles.body}>
                {isLoading && <Loader />}
                {filteredUsers.map(user => <User key={user.id} user={user} />)}
            </div>
        </div>
    )
}