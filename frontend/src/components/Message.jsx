import { useContext } from "react"
import { chatTime } from "../utils/functions"
import { AccountContext } from "./Account"

export default function Message({ message }) {
    const { account } = useContext(AccountContext)

    return (
        <div data-right={message.senderId === account.id} className="message">
            <div className="inner" data-right={message.userId % 2 === 0}>
                <p data-right={message.senderId === account.id} className="chat">
                    {message.message}
                </p>
                <p className="send-at">{chatTime(message.sendAt)}</p>
            </div>
        </div>
    )
}