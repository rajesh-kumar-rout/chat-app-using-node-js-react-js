import { useState } from "react"
import useRequest from "../../hooks/useRequest"
import { SERVER_ERROR } from "../../utils/constants"
import styles from "./ChangePasswordPage.module.css"
import button from "../../styles/Button.module.css"
import form from "../../styles/Form.module.css"

export default function ChangePasswordPage() {
    const request = useRequest()
    const [errors, setErrors] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [inputs, setInputs] = useState({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: ""
    })

    const hanelInputChange = (e) => {
        setInputs({
            ...inputs,
            [e.target.name]: e.target.value
        })
    }

    const isInputInvalid = () => {
        const { oldPassword, newPassword, confirmNewPassword } = inputs
        const errors = []

        if (!oldPassword) {
            errors.push("Old password is required")
        } else if (oldPassword.length > 20 || oldPassword.length < 6) {
            errors.push("Invalid old password")
        }

        if (!newPassword) {
            errors.push("New password is required")
        } else if (newPassword.length > 20 || newPassword.length < 6) {
            errors.push("New must be within 6-20 characters")
        }

        if (!confirmNewPassword) {
            errors.push("Please confirm your new password")
        } else if (confirmNewPassword !== newPassword) {
            errors.push("New password does not match")
        }

        setErrors(errors)
        return errors.length > 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (isInputInvalid()) return

        setIsLoading(true)
        const response = await request("/auth/change-password", {
            method: "PATCH",
            body: inputs
        })
        if (response.status === 200) {
            alert("Password changed successfully")
            setInputs({
                oldPassword: "",
                newPassword: "",
                confirmNewPassword: ""
            })
        } else if (response.status === 422) {
            alert("Old password does not match")
        } else {
            alert(SERVER_ERROR)
        }
        setIsLoading(false)
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>CHANGE PASSWORDD</div>

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
                    <label className={form.label} htmlFor="oldPassword">Old Password</label>
                    <input
                        type="password"
                        className={form.textInput}
                        name="oldPassword"
                        id="oldPassword"
                        value={inputs.oldPassword}
                        onChange={hanelInputChange}

                    />
                </div>

                <div className={form.group}>
                    <label className={form.label} htmlFor="newPassword">Old Password</label>
                    <input
                        type="password"
                        className={form.textInput}
                        name="newPassword"
                        id="newPassword"
                        value={inputs.newPassword}
                        onChange={hanelInputChange}
                    />
                </div>

                <div className={form.group}>
                    <label className={form.label} htmlFor="confirmNewPassword">Old Password</label>
                    <input
                        type="password"
                        className={form.textInput}
                        name="confirmNewPassword"
                        id="confirmNewPassword"
                        value={inputs.confirmNewPassword}
                        onChange={hanelInputChange}
                    />
                </div>

                <button
                    disabled={isLoading}
                    className={button.btn}
                    data-primary={true}
                >
                    {isLoading ? "Loading..." : "CHANGE PASSWORD"}
                </button>
            </form>
        </div>
    )
}