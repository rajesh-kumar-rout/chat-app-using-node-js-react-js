import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import Footer from "../../components/Footer/Footer"
import useRequest from "../../hooks/useRequest"
import styles from "./CreateAccountPage.module.css"
import button from "../../styles/Button.module.css"
import form from "../../styles/Form.module.css"

export default function SignUpPage() {
    const request = useRequest()
    const navigate = useNavigate()
    const [errors, setErrors] = useState([])
    const [loading, setLoading] = useState(false)
    const [inputs, setInputs] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const changeInputs = (e) => {
        setInputs({
            ...inputs,
            [e.target.name]: e.target.value
        })
    }

    const isInputInvalid = () => {
        const name = inputs.name.trim()
        const email = inputs.email.trim()
        const { password, confirmPassword } = inputs
        const errors = {}

        if (!name) {
            errors["name"] = "Name is required"
        } else if (name.length > 30) {
            errors["name"] = "Name must be within 30 characters"
        }

        if (email.length > 30) {
            errors["email"] = "Email must be within 30 characters"
        }

        if (!password) {
            errors["password"] = "Password is required"
        } else if (password.length > 20 || password.length < 6) {
            errors["password"] = "Passowrd must be within 6-20 characters"
        }

        if (!confirmPassword) {
            errors["confirmPassword"] = "Please confirm your password"
        } else if (confirmPassword !== password) {
            errors["confirmPassword"] = "Password does not match"
        }

        setErrors(errors)

        return Object.keys(errors).length === 0
    }

    const submitForm = async (e) => {
        e.preventDefault()

        if (!isInputInvalid()) return

        setLoading(true)
        const { status } = await request("/auth/sign-up", {
            method: "POST",
            body: inputs
        })
        if (status === 201) {
            alert("Sign up successfull.\nPlease login.")
            navigate("/login", { replace: true })
        } else if (status === 409) {
            setErrors({ email: "Email already taken" })
        }
        setLoading(false)
    }

    return (
        <>
            <form onSubmit={submitForm} className={styles.container}>
                <div className={styles.header}>Create new account</div>

                <div className={styles.body}>
                    <div className={form.group}>
                        <label className={form.label} htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className={form.textInput}
                            value={inputs.name}
                            onChange={changeInputs}
                        />
                        {errors.name && <span className={form.error}>{errors.name}</span>}
                    </div>

                    <div className={form.group}>
                        <label className={form.label} htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className={form.textInput}
                            value={inputs.email}
                            onChange={changeInputs}
                        />
                        {errors.email && <span className={form.error}>{errors.email}</span>}
                    </div>

                    <div className={form.group}>
                        <label className={form.label} htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className={form.textInput}
                            value={inputs.password}
                            onChange={changeInputs}
                        />
                        {errors.password && <span className={form.error}>{errors.password}</span>}
                    </div>

                    <div className={form.group}>
                        <label className={form.label} htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className={form.textInput}
                            value={inputs.confirmPassword}
                            onChange={changeInputs}
                        />
                        {errors.confirmPassword && <span className={form.error}>{errors.confirmPassword}</span>}
                    </div>

                    <button 
                        disabled={loading} 
                        className={button.btn} 
                        data-primary
                        data-full
                    >
                        {loading ? "Loading..." : "Create account"}
                    </button>

                    <p className={styles.link}>Already have an account ? <Link to="/login">Login</Link></p>
                </div>
            </form>

            <Footer />
        </>
    )
}