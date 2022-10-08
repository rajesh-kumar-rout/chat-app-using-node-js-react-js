import { MdSend, MdArrowBack } from "react-icons/md"
import { Link } from "react-router-dom"
import Message from "../../components/Message/Message"
import { messages } from "../../utils/faker"
import styles from "./ChatPage.module.css"

export default function ChatPage() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link to="/">
                    <MdArrowBack size={24}/>
                </Link>

                <p>John Doe</p>
            </div>

            <div className={styles.body}>
                {messages.map(message => <Message message={message}/>)}
            </div>

            <form className={styles.footer}>
                <input
                    type="text"
                    placeholder="Write Message..."
                />
                <button>
                    <MdSend size={24} />
                </button>
            </form>
        </div>
    )
}