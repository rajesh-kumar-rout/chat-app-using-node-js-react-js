import { useContext, useEffect, useState } from "react"
import { AppContext } from "../App"
import { AccountContext } from "../components/Account"
import { MdSearch } from "react-icons/md"
import User from "../components/User"
import Loader from "../components/Loader"
import axios from "../utils/axios"

export default function HomePage() {
    const { socket } = useContext(AppContext)
    const { account } = useContext(AccountContext)

    const [users, setUsers] = useState([])
    const [query, setQuery] = useState("")
    const [isFetching, setIsFetching] = useState(false)

    const filteredUsers = users.filter(user => user.name.toLowerCase().includes(query.toLowerCase()))

    const fetchUsers = async () => {
        const { data } = await axios.get("/users")
        setUsers(data)
        setIsFetching(false)
    }

    useEffect(() => {
        socket.on("messages", (message) => {
            if (message.receiverId !== account.id) return

            setUsers([
                {
                    ...users.find(user => user.id === message.senderId),
                    message: message.message
                },
                ...users.filter(user => user.id !== message.senderId)
            ])
        })

        return () => socket.off("messages")
    }, [users])

    useEffect(() => {
        fetchUsers()
    }, [])

    return (
        <div className="home-page">
            <div className="header">
                <MdSearch size={24} />
                <input
                    type="search"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search users..."
                />
            </div>

            <div className="body">
                {isFetching && <Loader />}
                {filteredUsers.map(user => <User key={user.id} user={user} />)}
            </div>
        </div>
    )
}