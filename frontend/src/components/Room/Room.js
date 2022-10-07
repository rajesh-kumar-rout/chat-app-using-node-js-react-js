import { useContext } from "react"
import { BsPeopleFill, BsFillChatFill } from "react-icons/bs"
import { FaTrash } from "react-icons/fa"
import { Link } from "react-router-dom"
import styles from "./Room.module.css"
import { AccountContext } from "../../components/Account"

export default function Room({ room }) {
    const { account: { id } } = useContext(AccountContext)

    return (
        <div className={styles.container}>
            <div>
                <h3>{room.name}</h3>

                <p className={styles.subTitle}>
                    by - {room.adminId === id ? "You" : room.admin}
                </p>
            </div>

            <div className={styles.icons}>
                <Link to={`/rooms/members`} state={room}>
                    <BsPeopleFill size={24} className={styles.icon} />
                </Link>

                <Link to={`/rooms/${room.id}/chat`}>
                    <BsFillChatFill size={24} className={styles.icon} />
                </Link>

                <FaTrash size={24} className={styles.icon}/>
            </div>
        </div>
    )
}