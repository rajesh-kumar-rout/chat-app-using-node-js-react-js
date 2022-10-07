import styles from "./LoginPage.module.css"
import buttons from "../../styles/Buttons.module.css"
import form from "../../styles/Form.module.css"
import { Link } from "react-router-dom"
import Footer from "../../components/Footer/Footer"
import { useState } from "react"

export default function LoginPage() {
    const [inputs, setInputs] = useState({
        email: "",
        password: ""
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
        const { email, password } = inputs
        const errors = []

        if (!email) {
            errors.push("Email is required")
        } else if (email.length > 30) {
            errors.push("Email must be within 30 characters")
        }

        if (!password) {
            errors.push("Password is required")
        } else if (password.length < 6 || password.length > 20) {
            errors.push("Password must be within 6-20 characters")
        }

        setErrors(errors)
        return errors.length > 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (isInputInvalid()) return

        setIsLoading(true)

        setTimeout(() => {
            setIsLoading(false)
        }, 1000);
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.header}>LOGIN</div>

                <form onSubmit={handleSubmit} className={styles.content}>
                    {errors.length > 0 && (
                        <div className={form.errors}>
                            <p>Please correct the following errors.</p>
                            {errors.map(error => (
                                <li>{error}</li>
                            ))}
                        </div>
                    )}

                    <div className={form.group}>
                        <label className={form.label} htmlFor="email">Email</label>
                        <input
                            type="email"
                            className={form.textInput}
                            name="email"
                            id="email"
                            onChange={handleInputChange}
                            value={inputs.email}
                        />
                    </div>

                    <div className={form.group}>
                        <label className={form.label} htmlFor="password">Password</label>
                        <input
                            type="password"
                            className={form.textInput}
                            name="password"
                            id="password"
                            value={inputs.password}
                            onChange={handleInputChange}
                        />
                    </div>

                    <button type="submit" disabled={isLoading} className={buttons.indigoFull}>
                        {isLoading ? "Loading..." : "LOGIN"}
                    </button>

                    <div className={styles.link}>Do not have account ? <Link to="/sign-up">Sign Up</Link></div>
                </form>
            </div>

            <Footer />
        </>
    )
}