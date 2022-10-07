import { BsPeopleFill, BsFillChatFill } from "react-icons/bs"
import { FaTrash } from "react-icons/fa"
import { Link } from "react-router-dom"
import styles from "./Room.module.css"

export default function Room({ room }) {
    return (
        <div className={styles.container}>
            <div>
                <h3>{room.name}</h3>

                <p className={styles.subTitle}>
                    by - {room.createdBy}
                </p>
            </div>

            <div className={styles.icons}>
                <Link to="/rooms/1/members">
                    <BsPeopleFill size={24} className={styles.icon} />
                </Link>

                <Link to="/rooms/1/chat">
                    <BsFillChatFill size={24} className={styles.icon} />
                </Link>

                <FaTrash size={24} className={styles.icon}/>
            </div>
        </div>
    )
}