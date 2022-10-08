import styles from "./Message.module.css"

export default function Message({ message }) {
    return (
        <div data-right={message.userId % 2 === 0} className={styles.container}>
            <div className={styles.innerContainer} data-right={message.userId % 2 === 0}>
                <p data-right={message.userId % 2 === 0} className={styles.chat}>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Perferendis nesciunt repellat eos corporis ut modi dolorem qui inventore perspiciatis.
                </p>
                <p className={styles.sendAt}>12:13 PM</p>
            </div>
        </div>
    )
}