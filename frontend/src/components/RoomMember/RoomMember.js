import styles from "./RoomMember.module.css"

export default function RoomMember({ member }) {
    return (
        <div className={styles.container}>
            <h3>{member.name}</h3>

            <p className={styles.subTitle}>
                by - {member.joinedAt}
            </p>
        </div>
    )
}