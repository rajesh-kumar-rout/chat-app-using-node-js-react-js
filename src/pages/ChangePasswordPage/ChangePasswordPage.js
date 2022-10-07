import styles from "./ChangePasswordPage.module.css"
import buttons from "../../styles/Buttons.module.css"
import form from "../../styles/Form.module.css"
import { useState } from "react"

export default function ChangePasswordPage() {
    const [inputs, setInputs] = useState({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: ""
    })
    const [errors, setErrors] = useState([])
    const [isLoading, setIsLoading] = useState(false)

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

        if(!confirmNewPassword){
            errors.push("Please confirm your new password")
        }else if(confirmNewPassword !== newPassword){
            errors.push("New password does not match")
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
            setInputs({
                oldPassword: "",
                newPassword: "",
                confirmNewPassword: ""
            })
        }, 1000);
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>CHANGE PASSWORD</div>

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

                <button disabled={isLoading} className={buttons.indigoFull}>
                    {isLoading ? "Loading..." : "CHANGE PASSWORD"}
                </button>
            </form>
        </div>
    )
}