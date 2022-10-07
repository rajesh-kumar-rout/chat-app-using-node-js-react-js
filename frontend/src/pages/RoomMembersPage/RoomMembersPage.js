import { members, rooms } from "../../utils/faker"
import RoomMember from "../../components/RoomMember/RoomMember"
import styles from "./RoomMembersPage.module.css"
import { Link } from "react-router-dom"
import { MdArrowBack } from "react-icons/md"

export default function RoomMembersPage() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link to="/">
                    <MdArrowBack size={24} />
                </Link>

                <p>Members of React Youtube</p>
            </div>

            <div className={styles.content}>
                {members.map(member => <RoomMember member={member} />)}
            </div>
        </div>
    )
}