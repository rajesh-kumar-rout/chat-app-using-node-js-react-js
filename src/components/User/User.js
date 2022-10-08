import { Link } from "react-router-dom"
import styles from "./User.module.css"

export default function User() {
    return (
        <Link to="/rooms/1/chat" className={styles.container}>
            <img src="https://cdn.pixabay.com/photo/2016/11/21/11/17/model-1844729__340.jpg" />
            <div>
                <h3 className={styles.username}>Rajesh Rout</h3>
                <p className={styles.lastMsg}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
            </div>
        </Link>
    )
}