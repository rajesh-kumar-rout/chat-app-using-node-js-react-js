import { useContext, useEffect, useRef, useState } from "react"
import { MdSend, MdArrowBack } from "react-icons/md"
import { Link, useLocation } from "react-router-dom"
import { AccountContext } from "../../components/Account"
import Message from "../../components/Message/Message"
import useRequest from "../../hooks/useRequest"
import { CLIENT_ERROR, SERVER_ERROR } from "../../utils/constants"
import { messages } from "../../utils/faker"
import styles from "./ChatPage.module.css"
import { io } from "socket.io-client"

const socket = io("ws://localhost:3001")

export default function ChatPage() {
    const { account } = useContext(AccountContext)
    const request = useRequest()
    const { state } = useLocation()
    const [messages, setMessages] = useState([])
    const scrollRef= useRef()
    const [message, setMessage] = useState("")

    useEffect(() => {
        socket.on("messages", (message) => {
            if(message.receiverId === account.id || message.senderId === account.id){
                setMessages([
                    ...messages,
                    message
                ])
            }
        })

        return () => {
            socket.off("connect");
            socket.off("messages")
        }
    }, [messages])

    const fetchMessages = async () => {
        try {
            const response = await request(`/users/${state.id}/messages`)
            if (response.status === 200) {
                setMessages(await response.json())
            } else {
                alert(SERVER_ERROR)
            }
        } catch {
            alert(CLIENT_ERROR)
        }
    }

    useEffect(() => {
        var objDiv = document.getElementById("demo");
objDiv.scrollTop = objDiv.scrollHeight;
     }, [messages])

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

    useEffect(() => {
        fetchMessages()
    }, [])

    return (
        <div className={styles.container} >
            <div className={styles.header}>
                <Link to="/">
                    <MdArrowBack size={24} />
                </Link>

                <p>{state.name}</p>
            </div>

            <div className={styles.body} ref={scrollRef} id="demo">
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