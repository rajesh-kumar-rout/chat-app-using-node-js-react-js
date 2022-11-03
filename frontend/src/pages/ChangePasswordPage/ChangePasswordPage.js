import { useState } from "react"
import useRequest from "../../hooks/useRequest"
import styles from "./ChangePasswordPage.module.css"
import button from "../../styles/Button.module.css"
import form from "../../styles/Form.module.css"

export default function ChangePasswordPage() {
    const request = useRequest()
    const initialInputs = {
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: ""
    }
    const [errors, setErrors] = useState([])
    const [loading, setLoading] = useState(false)
    const [inputs, setInputs] = useState(initialInputs)

    const changeInput = (e) => {
        setInputs({
            ...inputs,
            [e.target.name]: e.target.value
        })
    }

    const isValidInput = () => {
        const { oldPassword, newPassword, confirmNewPassword } = inputs
        const errors = {}

        if (!oldPassword) {
            errors["oldPassword"] = "Old password is required"
        } else if (oldPassword.length > 20 || oldPassword.length < 6) {
            errors["oldPassword"] = "Invalid old password"
        }

        if (!newPassword) {
            errors["newPassword"] = "New password is required"
        } else if (newPassword.length > 20 || newPassword.length < 6) {
            errors["newPassword"] = "New must be within 6-20 characters"
        }

        if (!confirmNewPassword) {
            errors["confirmNewPassword"] = "Please confirm your new password"
        } else if (confirmNewPassword !== newPassword) {
            errors["confirmNewPassword"] = "New password does not match"
        }

        setErrors(errors)

        return Object.keys(errors).length === 0
    }

    const submitForm = async (e) => {
        e.preventDefault()

        if (!isValidInput()) return

        setLoading(true)
        const { status } = await request("/auth/change-password", {
            method: "PATCH",
            body: inputs
        })
        if (status === 200) {
            alert("Password changed successfully")
            setInputs(initialInputs)
        } else if (status === 422) {
            alert("Old password does not match")
        }
        setLoading(false)
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>Change Password</div>

            <form onSubmit={submitForm} className={styles.body}>
                <div className={form.group}>
                    <label className={form.label} htmlFor="oldPassword">Old Password</label>
                    <input
                        type="password"
                        id="oldPassword"
                        name="oldPassword"
                        className={form.textInput}
                        value={inputs.oldPassword}
                        onChange={hanelInputChange}
                    />
                    {errors.oldPassword && <span className={form.error}>{errors.oldPassword}</span>}
                </div>

                <div className={form.group}>
                    <label className={form.label} htmlFor="newPassword">New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        className={form.textInput}
                        value={inputs.newPassword}
                        onChange={hanelInputChange}
                    />
                    {errors.newPassword && <span className={form.error}>{errors.newPassword}</span>}
                </div>

                <div className={form.group}>
                    <label className={form.label} htmlFor="confirmNewPassword">Confirm New Password</label>
                    <input
                        type="password"
                        id="confirmNewPassword"
                        name="confirmNewPassword"
                        className={form.textInput}
                        value={inputs.confirmNewPassword}
                        onChange={hanelInputChange}
                    />
                    {errors.confirmNewPassword && <span className={form.error}>{errors.confirmNewPassword}</span>}
                </div>

                <button
                    disabled={loading}
                    className={button.btn}
                    data-primary={true}
                >
                    {loading ? "Loading..." : "Change Password"}
                </button>
            </form>
        </div>
    )
}