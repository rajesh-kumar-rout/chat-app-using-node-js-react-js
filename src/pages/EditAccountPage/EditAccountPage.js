import { useContext, useState } from "react"
import { AccountContext } from "../../components/Account"
import { SERVER_ERROR } from "../../utils/constants"
import useRequest from "../../hooks/useRequest"
import button from "../../styles/Button.module.css"
import form from "../../styles/Form.module.css"
import styles from "./EditAccountPage.module.css"

export default function EditAccountPage() {
    const request = useRequest()
    const { account, setAccount } = useContext(AccountContext)
    const [errors, setErrors] = useState([])
    const [loading, setLoading] = useState(false)
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

    const isValidInput = () => {
        const name = inputs.name.trim()
        const email = inputs.email.trim()
        const errors = {}

        if (!name) {
            errors["name"] = "Name is required"
        } else if (name.length > 30) {
            errors["name"] = "Name must be within 30 characters"
        }

        if (!email) {
            errors["email"] = "Email is required"
        } else if (email.length > 30) {
            errors["email"] = "Email must be within 30 characters"
        }

        setErrors(errors)

        return Object.keys(errors).length === 0
    }

    const submitForm = async (e) => {
        e.preventDefault()

        if (!isValidInput()) return

        const payload = new FormData()
        Object.keys(inputs).forEach(key => {
            payload.append(key, inputs[key])
        })

        setLoading(true)
        const { status, data } = await request("/auth/edit-account", {
            method: "PATCH",
            body: payload
        })
        if (status === 200) {
            alert("Account edited successfully")
            setAccount({
                ...account,
                name: inputs.name,
                email: inputs.email,
                profileImgUrl: data.profileImgUrl
            })
        } else if (status === 409) {
            setErrors({ email: "Email already taken" })
        }
        setLoading(false)
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>EDIT ACCOUNT</div>

            <form onSubmit={handleSubmit} className={styles.body}>
                <div className={form.group}>
                    <label className={form.label} htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className={form.textInput}
                        value={inputs.name}
                        onChange={handleInputChange}
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
                        onChange={handleInputChange}
                    />
                    {errors.email && <span className={form.error}>{errors.email}</span>}
                </div>

                <div className={form.group}>
                    <label className={form.label} htmlFor="proifleImg">Profile Image</label>
                    <input
                        type="file"
                        id="proifleImg"
                        name="profileImg"
                        className={form.textInput}
                        onChange={handleInputChange}
                        accept="image/jpeg, image/jpg, image/png"
                    />
                </div>

                <button 
                    disabled={loading} 
                    className={button.btn} 
                    data-primary
                    data-full
                >
                    {loading ? "Loading..." : "Save"}
                </button>
            </form>
        </div>
    )
}