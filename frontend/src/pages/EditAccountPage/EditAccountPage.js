import styles from "./EditAccountPage.module.css"
import buttons from "../../styles/Buttons.module.css"
import form from "../../styles/Form.module.css"
import { useState } from "react"

export default function EditAccountPage() {
    const [inputs, setInputs] = useState({
        email: "",
        name: ""
    })
    const [errors, setErrors] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const handleInputChange = (e) => {
        setInputs({
            ...inputs,
            [e.target.name]: e.target.value
        })
    }

    const isInputInvalid = () => {
        const name = inputs.name.trim()
        const email = inputs.email.trim()
        const errors = []

        if (!name) {
            errors.push("Name is required")
        } else if (name.length > 30) {
            errors.push("Name must be within 30 characters")
        }

        if (!email) {
            errors.push("Email is required")
        } else if (email.length > 30) {
            errors.push("Email must be within 30 characters")
        }

        setErrors(errors)
        return errors.length > 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if(isInputInvalid()) return

        setIsLoading(true)

        setTimeout(() => {
            setIsLoading(false)
        }, 1000);
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>EDIT ACCOUNT</div>

            <form onSubmit={handleSubmit} className={styles.content}>
                {errors.length > 0 && (
                    <div className={form.errors}>
                        <p>Please correct the following errors.</p>
                        <ul>
                            {errors.map(error => (
                                <li>{error}</li>
                            ))}
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
                        value={inputs.name}
                        onChange={handleInputChange}
                    />
                </div>

                <div className={form.group}>
                    <label className={form.label} htmlFor="email">Email</label>
                    <input
                        type="email"
                        className={form.textInput}
                        name="email"
                        id="email"
                        value={inputs.email}
                        onChange={handleInputChange}
                    />
                </div>

                <button disabled={isLoading} className={buttons.indigoFull}>
                    {isLoading ? "Loading..." : "CHANGE PASSWORD"}
                </button>
            </form>
        </div>
    )
}