import { useEffect, useState } from "react"
import { CLIENT_ERROR, SERVER_ERROR } from "../../utils/constants"
import useRequest from "../../hooks/useRequest"
import User from "../../components/User/User"
import { MdSearch } from "react-icons/md"
import styles from "./HomePage.module.css"

export default function HomePage() {
    const request = useRequest()
    const [rooms, setRooms] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const fetchRooms = async () => {
        setIsLoading(true)
        try {
            const response = await request("/rooms")
            if (response.status === 200) {
                setRooms(await response.json())
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

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <MdSearch size={24} />
                <input type="search" placeholder="Search users..." autoFocus />
            </div>

            <div className={styles.body}>
                <User />
                <User />
                <User />
                <User />
                <User />
                <User />
            </div>
        </div>
    )
}