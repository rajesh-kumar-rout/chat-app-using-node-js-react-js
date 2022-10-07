import styles from "./CreateRoomPage.module.css"
import buttons from "../../styles/Buttons.module.css"
import form from "../../styles/Form.module.css"
import { useState } from "react"
import useRequest from "../../hooks/useRequest"
import { CLIENT_ERROR, SERVER_ERROR } from "../../utils/constants"

export default function CreateRoomPage() {
    const request = useRequest()
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState("")

    const isInputInvalid = () => {
        const nameInput = name.trim()
        let err = ""

        if (!nameInput) {
            err = "Name is required"
        } else if (nameInput.length > 20) {
            err = "Name must be within 20 characters"
        }

        setError(err)
        return err
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (isInputInvalid()) return

        setIsLoading(true)
        try {
            const response = await request("/rooms", {
                method: "POST",
                body: JSON.stringify({ name })
            })
            if (response.status === 201) {
                alert("Room created successfully")
                setName("")
            } else if (response.status === 409) {
                alert("Room already exists.")
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
        <div className={styles.container}>
            <div className={styles.header}>CREATE NEW ROOM</div>

            <form onSubmit={handleSubmit} className={styles.content}>
                {error && (
                    <div className={form.errors}>
                        <p>Please correct the following errors.</p>
                        <ul>
                            <li>{error}</li>
                        </ul>
                    </div>
                )}

                <div className={form.group}>
                    <label className={form.label} htmlFor="name">Name</label>
                    <input
                        type="text"
                        className={form.textInput}
                        name="name"
                        id="name"
                        value={name}
                        onChange={e => setName(e.target.value)}

                    />
                </div>

                <button disabled={isLoading} className={buttons.indigoFull}>
                    {isLoading ? "Loading..." : "CREATE"}
                </button>
            </form>
        </div>
    )
}