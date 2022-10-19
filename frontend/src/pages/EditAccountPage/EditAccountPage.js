import { useContext, useState } from "react"
import { AccountContext } from "../../components/Account"
import { CLIENT_ERROR, SERVER_ERROR } from "../../utils/constants"
import useRequest from "../../hooks/useRequest"
import button from "../../styles/Button.module.css"
import form from "../../styles/Form.module.css"
import styles from "./EditAccountPage.module.css"

export default function EditAccountPage() {
    const request = useRequest()
    const { account, setAccount } = useContext(AccountContext)
    const [errors, setErrors] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [inputs, setInputs] = useState({
        name: account.name,
        email: account.email,
        profileImg: null
    })

    const handleInputChange = (e) => {
        setInputs({
            ...inputs,
            [e.target.name]: e.target.type === "file" ? e.target.files[0] : e.target.value
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

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (isInputInvalid()) return

        const payload = new FormData()
        Object.keys(inputs).forEach(key => {
            payload.append(key, inputs[key])
        })

        setIsLoading(true)
        const response = await request("/auth/edit-account", {
            method: "PATCH",
            body: payload
        })
        if (response.status === 200) {
            alert("Account edited successfully")
            const data = await response.json()
            setAccount({
                ...account,
                name: inputs.name,
                email: inputs.email,
                profileImgUrl: data.profileImgUrl
            })
        } else if (response.status === 409) {
            alert("Email already taken")
        } else {
            alert(SERVER_ERROR)
        }
        setIsLoading(false)
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>EDIT ACCOUNT</div>

            <form onSubmit={handleSubmit} className={styles.body}>
                {errors.length > 0 && (
                    <div className={form.errors}>
                        <p>Please correct the following errors.</p>
                        <ul>
                            {errors.map(error => (
                                <li key={error}>{error}</li>
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

                <div className={form.group}>
                    <label className={form.label} htmlFor="proifleImg">Profile Image</label>
                    <input
                        type="file"
                        className={form.textInput}
                        name="profileImg"
                        id="proifleImg"
                        onChange={handleInputChange}
                    />
                </div>

                <button disabled={isLoading} className={button.btn} data-primary={true}>
                    {isLoading ? "Loading..." : "SAVE CHANGES"}
                </button>
            </form>
        </div>
    )
}