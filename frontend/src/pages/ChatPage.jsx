import { useContext, useEffect, useRef, useState } from "react"
import { MdArrowBack } from "react-icons/md"
import { Link, useLocation } from "react-router-dom"
import { toast } from "react-toastify"
import { AppContext } from "../App"
import { AccountContext } from "../components/Account"
import Loader from "../components/Loader"
import Message from "../components/Message"
import axios from "../utils/axios"

export default function ChatPage() {
    const { account } = useContext(AccountContext)
    const { socket } = useContext(AppContext)
    const { state } = useLocation()
    const bodyRef = useRef()

    const [messages, setMessages] = useState([])
    const [isFetching, setIsFetching] = useState(true)
    const [message, setMessage] = useState("")

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (message.trim() === 0 || message.length > 255) return toast.error("Message must be within 1-255 characters")

        const newMessage = {
            receiverId: state.id,
            senderId: account.id,
            message,
            sendAt: new Date().toISOString()
        }

        socket.emit("message", newMessage)

        axios.post(`/users/${state.id}/messages`, newMessage)

        setMessage("")
    }

    const fetchMessages = async () => {
        const { data } = await axios.get(`/users/${state.id}/messages`)
        setMessages(data)
        setIsFetching(false)
    }

    useEffect(() => {
        socket.on("messages", (message) => {
            if (!((message.receiverId === account.id && message.senderId === state.id) || (message.receiverId === state.id && message.senderId === account.id))) return

            setMessages([
                ...messages,
                message
            ])
        })

        if (bodyRef.current) {
            bodyRef.current.scrollTop = bodyRef.current.scrollHeight
        }

        return () => socket.off("messages")
    }, [messages])

    useEffect(() => {
        fetchMessages()
    }, [])
    console.log(state);
    return (
        <div className="chat-page">
            <div className="header">
                <Link to="/">
                    <MdArrowBack size={24} />
                </Link>

                <p>{state.name}</p>
            </div>

            <div className="body" ref={bodyRef}>
                {isFetching && <Loader />}
                {messages.map(message => <Message key={message.id} message={message} />)}
            </div>

            <form onSubmit={handleSubmit} className="footer">
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