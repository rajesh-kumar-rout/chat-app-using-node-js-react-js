import styles from "./SignUpPage.module.css"
import buttons from "../../styles/Buttons.module.css"
import form from "../../styles/Form.module.css"
import { Link, useNavigate } from "react-router-dom"
import Footer from "../../components/Footer/Footer"
import { useState } from "react"
import { CLIENT_ERROR, SERVER_ERROR } from "../../utils/constants"
import useRequest from "../../hooks/useRequest"

export default function SignUpPage() {
    const request = useRequest()
    const navigate = useNavigate()
    const [inputs, setInputs] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
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
        const { password, confirmPassword } = inputs
        const errors = []

        if (!name) {
            errors.push("Name is required")
        } else if (name.length > 30) {
            errors.push("Name must be within 30 characters")
        }

        if (email.length > 30) {
            errors.push("Email must be within 30 characters")
        }

        if (!password) {
            errors.push("Password is required")
        } else if (password.length > 20 || password.length < 6) {
            errors.push("Passowrd must be within 6-20 characters")
        }

        if (!confirmPassword) {
            errors.push("Please confirm your password")
        } else if (confirmPassword !== password) {
            errors.push("Password does not match")
        }

        setErrors(errors)
        return errors.length > 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (isInputInvalid()) return

        setIsLoading(true)
        try {
            const response = await request("/auth/sign-up", {
                method: "POST",
                body: JSON.stringify(inputs)
            })
            if (response.status === 201) {
                alert("Sign up successfull.\nPlease login.")
                navigate("/login", { replace: true })
            } else if (response.status === 409) {
                alert("Email already taken")
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
        <>
            <form onSubmit={handleSubmit} className={styles.container}>
                <div className={styles.header}>SIGN UP</div>

                <div className={styles.content}>
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
                            onChange={handleInputChange}
                            value={inputs.name}
                        />
                    </div>

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
                            onChange={handleInputChange}
                            value={inputs.password}
                        />
                    </div>

                    <div className={form.group}>
                        <label className={form.label} htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            className={form.textInput}
                            name="confirmPassword"
                            id="confirmPassword"
                            onChange={handleInputChange}
                            value={inputs.confirmPassword}
                        />
                    </div>

                    <button disabled={isLoading} className={buttons.indigoFull}>
                        {isLoading ? "Loading..." : "SIGN UP"}
                    </button>

                    <div className={styles.link}>Already have an account ? <Link to="/login">Login</Link></div>
                </div>
            </form>

            <Footer />
        </>
    )
}