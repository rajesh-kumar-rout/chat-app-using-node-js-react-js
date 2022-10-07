import { Link } from "react-router-dom"
import { MdArrowBack } from "react-icons/md"
import SearchedRoom from "../../components/SearchedRoom/SearchedRoom"
import styles from "./SearchRoomPage.module.css"
import { rooms } from "../../utils/faker"

export default function SearchRoomPage() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link to="/">
                    <MdArrowBack size={24} />
                </Link>

                <input 
                    autoFocus 
                    type="search" 
                    placeholder="Search chat rooms..." 
                    className={styles.input}
                />
            </div>

            <div className={styles.content}>
                {rooms.map(room => <SearchedRoom room={room}/>)}
            </div>
        </div>
    )
}