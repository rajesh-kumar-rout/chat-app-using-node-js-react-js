import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import Footer from "../../components/Footer/Footer"
import useRequest from "../../hooks/useRequest"
import styles from "./LoginPage.module.css"
import button from "../../styles/Button.module.css"
import form from "../../styles/Form.module.css"

export default function LoginPage() {
    const request = useRequest()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [inputs, setInputs] = useState({
        email: "",
        password: ""
    })

    const changeInputs = (e) => {
        setInputs({
            ...inputs,
            [e.target.name]: e.target.value
        })
    }

    const submitForm = async (e) => {
        e.preventDefault()

        setLoading(true)
        const { status, body } = await request("/auth/login", {
            method: "POST",
            body: inputs
        })
        if (status === 200) {
            localStorage.setItem("jwtToken", body.jwtToken)
            navigate("/", { replace: true })
        } else if (status === 422) {
            alert("Invalid email or password")
        }
        setLoading(false)
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.header}>Login</div>

                <form onSubmit={submitForm} className={styles.body}>
                    <div className={form.group}>
                        <label className={form.label} htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className={form.textInput}
                            value={inputs.email}
                            onChange={changeInputs}
                            required
                        />
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
                            required
                        />
                    </div>

                    <button
                        disabled={loading}
                        className={button.btn}
                        data-primary
                        data-full
                    >
                        {loading ? "Loading..." : "Login"}
                    </button>

                    <p className={styles.link}>Do not have account ? <Link to="/create-account">Create account</Link></p>
                </form>
            </div>

            <Footer />
        </>
    )
}