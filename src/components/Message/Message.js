import { useContext } from "react"
import { AccountContext } from "../Account"
import styles from "./Message.module.css"

export default function Message({ message }) {
    const { account } = useContext(AccountContext)

    return (
        <div data-right={message.senderId === account.id} className={styles.container}>
            <div className={styles.innerContainer} data-right={message.userId % 2 === 0}>
                <p data-right={message.senderId === account.id} className={styles.chat}>
                    {message.message}
                </p>
                <p className={styles.sendAt}>{message.sendAt}</p>
            </div>
        </div>
    )
}