import styles from "./RoomMember.module.css"

export default function RoomMember({ member }) {
    return (
        <div className={styles.container}>
            <h3>{member.name}</h3>

            <p className={styles.subTitle}>
                joined At - {member.createdAt}
            </p>
        </div>
    )
}