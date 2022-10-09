import { useEffect, useState } from "react"
import { CLIENT_ERROR, SERVER_ERROR } from "../../utils/constants"
import useRequest from "../../hooks/useRequest"
import User from "../../components/User/User"
import { MdSearch } from "react-icons/md"
import styles from "./HomePage.module.css"

export default function HomePage() {
    const request = useRequest()
    const [users, setUsers] = useState([])
    const [query, setQuery] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const filteredUsers = users.filter(user => user.name.toLowerCase().includes(query.toLowerCase()))

    const fetchRooms = async () => {
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
        fetchRooms()
    }, [])

    console.log(users);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <MdSearch size={24} />
                <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search users..." autoFocus />
            </div>

            <div className={styles.body}>
                {filteredUsers.map(user => <User user={user} />)}
            </div>
        </div>
    )
}