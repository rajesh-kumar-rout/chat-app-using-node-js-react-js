import styles from "./LoginPage.module.css"
import buttons from "../../styles/Buttons.module.css"
import form from "../../styles/Form.module.css"
import { Link, useNavigate } from "react-router-dom"
import Footer from "../../components/Footer/Footer"
import { useState } from "react"
import { CLIENT_ERROR, SERVER_ERROR } from "../../utils/constants"
import useRequest from "../../hooks/useRequest"

export default function LoginPage() {
    const request = useRequest()
    const navigate = useNavigate()

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
        }

        if (!password) {
            errors.push("Password is required")
        }

        setErrors(errors)
        return errors.length > 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (isInputInvalid()) return

        setIsLoading(true)
        try {
            const response = await request("/auth/login", {
                method: "POST",
                body: JSON.stringify(inputs)
            })
            if (response.status === 200) {
                const { jwtToken } = await response.json()
                localStorage.setItem("jwtToken", jwtToken)
                navigate("/", { replace: true })
            } else if (response.status === 422) {
                alert("Invalid email or password")
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

                    <button 
                        type="submit" 
                        disabled={isLoading} 
                        className={buttons.indigoFull}
                    >
                        {isLoading ? "Loading..." : "LOGIN"}
                    </button>

                    <div className={styles.link}>Do not have account ? <Link to="/sign-up">Sign Up</Link></div>
                </form>
            </div>

            <Footer />
        </>
    )
}