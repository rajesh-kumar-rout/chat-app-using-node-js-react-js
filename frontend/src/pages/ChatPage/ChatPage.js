import { MdSend, MdArrowBack } from "react-icons/md"
import { Link } from "react-router-dom"
import Message from "../../components/Message/Message"
import { messages } from "../../utils/faker"
import styles from "./ChatPage.module.css"

export default function ChatPage() {
    return (
        <div className={styles.container}>
            <div className={styles.heading}>
                <Link to="/">
                    <MdArrowBack size={24}/>
                </Link>

                <p>React Youtube</p>
            </div>

            <div className={styles.content}>
                {messages.map(message => <Message message={message}/>)}
            </div>

            <div className={styles.footer}>
                <input
                    type="text"
                    placeholder="Write Message..."
                    className={styles.input}
                />
                <button className={styles.btnSend}>
                    <MdSend size={24} />
                </button>
            </div>
        </div>
    )
}