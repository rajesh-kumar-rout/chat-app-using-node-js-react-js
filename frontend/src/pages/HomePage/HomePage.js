import { rooms } from "../../utils/faker"
import Room from "../../components/Room/Room"
import styles from "./HomePage.module.css"
import { useEffect, useState } from "react"
import { CLIENT_ERROR, SERVER_ERROR } from "../../utils/constants"
import useRequest from "../../hooks/useRequest"

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
            <div className={styles.header}>All Rooms</div>

            <div className={styles.content}>
                {rooms.map(room => <Room room={room} key={room.id} />)}
            </div>
        </div>
    )
}