import { rooms } from "../../utils/faker"
import Room from "../../components/Room/Room"
import styles from "./HomePage.module.css"

export default function HomePage() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>All Rooms</div>

            <div className={styles.content}>
                {rooms.map(room => <Room room={room} />)}
            </div>
        </div>
    )
}