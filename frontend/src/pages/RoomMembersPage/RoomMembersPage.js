import { members, rooms } from "../../utils/faker"
import RoomMember from "../../components/RoomMember/RoomMember"
import styles from "./RoomMembersPage.module.css"
import { Link, useLocation, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { CLIENT_ERROR, SERVER_ERROR } from "../../utils/constants"
import useRequest from "../../hooks/useRequest"
import { MdArrowBack } from "react-icons/md"

export default function RoomMembersPage() {
    const { state } = useLocation()
    const request = useRequest()
    const [members, setMembers] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const fetchRoomMembers = async () => {
        setIsLoading(true)
        try {
            const response = await request(`/rooms/${state.id}/members`)
            if (response.status === 200) {
                setMembers(await response.json())
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
        fetchRoomMembers()
    }, [])

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link to="/">
                    <MdArrowBack size={24} />
                </Link>

                <p>Members of {state.name}</p>
            </div>

            <div className={styles.content}>
                {members.map(member => <RoomMember member={member} />)}
            </div>
        </div>
    )
}