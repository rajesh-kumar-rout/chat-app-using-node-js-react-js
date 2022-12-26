import { useContext } from "react"
import { AccountContext } from "../components/Account"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { toast } from "react-toastify"
import * as Yup from "yup"
import axios from "../utils/axios"

const validationSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, "Name must be at least 2 characters")
        .max(30, "Name must be within 30 characters")
        .required("Name is required")
})

export default function EditAccountPage() {
    const { account, setAccount } = useContext(AccountContext)

    const handleSubmit = async (values, { setSubmitting }) => {
        const formData = new FormData()
        Object.keys(values).forEach(key => formData.append(key, values[key]))

        setSubmitting(true)

        try {
            const { data } = await axios.patch("/auth/edit-account", formData)
            toast.success("Account edited successfully")
            setAccount({
                ...account,
                name: values.name,
                email: values.email,
                profileImgUrl: data.profileImgUrl
            }) 
        } catch ({ response }) {
            response?.status === 409 && toast.error("Email already taken")
        }

        setSubmitting(false)
    }

    return (
        <Formik
            initialValues={{
                name: account.name,
                email: account.email,
                profileImg: ""
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting, setFieldValue }) => (
                <div className="form-card">
                    <div className="header">Edit Account</div>

                    <Form className="body">
                        <div className="input-group">
                            <label className="input-label" htmlFor="name">Name</label>
                            <Field
                                type="text"
                                id="name"
                                className="text-input"
                                name="name"
                            />
                            <ErrorMessage component="p" name="name" className="form-error"/>
                        </div>

                        <div className="input-group">
                            <label className="input-label" htmlFor="email">Email</label>
                            <Field
                                type="email"
                                id="email"
                                className="text-input"
                                name="email"
                                disabled
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label" htmlFor="profileImg">Profile Image</label>
                            <input
                                type="file"
                                id="profileImg"
                                className="text-input"
                                name="profileImg"
                                onChange={event => setFieldValue("profileImg", event.target.files[0])}
                                accept="image/jpeg, image/jpg, image/png"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-primary btn-full"
                        >
                            {isSubmitting ? "Please Wait..." : "Save"}
                        </button>
                    </Form>
                </div>
            )}
        </Formik>
    )
}