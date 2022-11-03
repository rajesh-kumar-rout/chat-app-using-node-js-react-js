import { useContext, useEffect, useRef, useState } from "react"
import { MdArrowBack } from "react-icons/md"
import { Link, useLocation } from "react-router-dom"
import { SocketContext } from "../../App"
import { AccountContext } from "../../components/Account"
import Loader from "../../components/Loader/Loader"
import Message from "../../components/Message/Message"
import useRequest from "../../hooks/useRequest"
import styles from "./ChatPage.module.css"

export default function ChatPage() {
    const { account } = useContext(AccountContext)
    const request = useRequest()
    const { state } = useLocation()
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const { socket } = useContext(SocketContext)
    const bodyRef = useRef()

    useEffect(() => {
        socket.on("messages", (message) => {
            if (message.receiverId === account.id || message.senderId === account.id) {
                setMessages([
                    ...messages,
                    message
                ])
            }
        })

        if (bodyRef.current) {
            bodyRef.current.scrollTop = bodyRef.current.scrollHeight
        }

        return () => socket.off("messages")
    }, [messages])

    useEffect(() => {
        fetchMessages()
    }, [])

    const submitForm = async (e) => {
        e.preventDefault()

        if (!message.trim()) return

        if (message.length > 255) {
            alert("Message length must be lower than 255 characters")
            return
        }

        const newMessage = {
            receiverId: state.id,
            senderId: account.id,
            message,
            sendAt: new Date().toISOString()
        }

        socket.emit("message", newMessage)

        request(`/users/${state.id}/messages`, {
            method: "POST",
            body: newMessage
        })

        setMessage("")
    }

    const fetchMessages = async () => {
        setLoading(true)
        const { body } = await request(`/users/${state.id}/messages`)
        setMessages(body)
        setLoading(false)
    }

    return (
        <div className={styles.container} >
            <div className={styles.header}>
                <Link to="/">
                    <MdArrowBack size={24} />
                </Link>

                <p>{state.name}</p>
            </div>

            <div className={styles.body} ref={bodyRef}>
                {isLoading && <Loader />}
                {messages.map(message => <Message key={message.id} message={message} />)}
            </div>

            <form onSubmit={submitForm} className={styles.footer}>
                <input
                    type="text"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Write Message..."
                />
            </form>
        </div>
    )
}