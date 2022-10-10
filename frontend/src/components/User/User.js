import { Link } from "react-router-dom"
import { DEFAULT_PROFILE_IMG } from "../../utils/constants"
import styles from "./User.module.css"

export default function User({ user }) {
    return (
        <Link to={`/rooms/chat`} state={user} className={styles.container}>
            <img src={user.profileImgUrl ?? DEFAULT_PROFILE_IMG} />
            <div className={styles.infoContainer}>
                <h3 className={styles.username}>{user.name}</h3>
                <p className={styles.lastMsg}>{user.message}</p>
            </div>
        </Link>
    )
}