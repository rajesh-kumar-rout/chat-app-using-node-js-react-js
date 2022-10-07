import styles from "./SearchedRoom.module.css"
import buttons from "../../styles/Buttons.module.css"

export default function SearchedRoom({ room }) {
    return (
        <div className={styles.container}>
            <div>
                <h3 className={styles.title}>{room.name}</h3>

                <p className={styles.subTitle}>
                    by - {room.createdBy}
                </p>
            </div>

            <button className={buttons.white}>Join</button>
        </div>
    )
}