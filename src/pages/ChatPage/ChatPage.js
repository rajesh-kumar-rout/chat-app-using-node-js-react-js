import { useContext, useEffect, useRef, useState } from "react"
import { MdSend, MdArrowBack } from "react-icons/md"
import { Link, useLocation } from "react-router-dom"
import { SocketContext } from "../../App"
import { AccountContext } from "../../components/Account"
import Loader from "../../components/Loader/Loader"
import Message from "../../components/Message/Message"
import useRequest from "../../hooks/useRequest"
import { CLIENT_ERROR, SERVER_ERROR } from "../../utils/constants"
import { messages } from "../../utils/faker"
import styles from "./ChatPage.module.css"

export default function ChatPage() {
    const { account } = useContext(AccountContext)
    const request = useRequest()
    const { state } = useLocation()
    const [messages, setMessages] = useState([])
    const [isLoading, setIsLoading] = useState(false)
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

        return () => socket.off("messages")
    }, [messages])

    useEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTop = bodyRef.current.scrollHeight
        }
    }, [messages])

    useEffect(() => {
        fetchMessages()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!message.trim()) return

        const newMessage = {
            receiverId: state.id,
            senderId: account.id,
            message,
            sendAt: new Date().toISOString()
        }

        socket.emit("message", newMessage)

        request(`/users/${state.id}/messages`, {
            method: "POST",
            body: JSON.stringify(newMessage)
        })

        setMessage("")
    }

    const fetchMessages = async () => {
        setIsLoading(true)
        try {
            const response = await request(`/users/${state.id}/messages`)
            if (response.status === 200) {
                setMessages(await response.json())
            } else {
                alert(SERVER_ERROR)
            }
        } catch {
            alert(CLIENT_ERROR)
        } finally {
            setIsLoading(false)
        }
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
                {messages.map(message => <Message message={message} />)}
            </div>

            <form onSubmit={handleSubmit} className={styles.footer}>
                <input
                    type="text"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Write Message..."
                />
                <button>
                    <MdSend size={24} />
                </button>
            </form>
        </div>
    )
}