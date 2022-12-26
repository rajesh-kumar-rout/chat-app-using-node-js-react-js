import { Formik, Form, Field, ErrorMessage } from "formik"
import { toast } from "react-toastify"
import * as Yup from "yup"
import axios from "../utils/axios"

const validationSchema = Yup.object().shape({
    oldPassword: Yup.string()
        .min(6, "Invalid old password")
        .max(20, "Invalid old password")
        .required("Old password is required"),

    newPassword: Yup.string()
        .min(6, "New password must be at least 6 characters")
        .max(20, "New password must be within 20 characters")
        .required("New password is required"),

    confirmNewPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "New password does not match")
        .required("Please confirm your new password")
})

export default function ChangePasswordPage() {
    const handleSubmit = async (values, { resetForm, setSubmitting }) => {
        setSubmitting(true)

        try {
            await axios.patch("/auth/change-password", values)
            toast.success("Password changed successfully")
            resetForm()
        } catch ({ response }) {
            response?.status === 422 && toast.error("Old password does not match")
        }

        setSubmitting(false)
    }

    return (
        <Formik
            initialValues={{
                oldPassword: "",
                newPassword: "",
                confirmNewPassword: ""
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting }) => (
                <div className="form-card">
                    <div className="header">Change Password</div>

                    <Form className="body">
                        <div className="input-group">
                            <label className="input-label" htmlFor="oldPassword">Old Password</label>
                            <Field
                                type="password"
                                id="oldPassword"
                                className="text-input"
                                name="oldPassword"
                            />
                            <ErrorMessage component="p" name="oldPassword" className="form-error" />
                        </div>

                        <div className="input-group">
                            <label className="input-label" htmlFor="newPassword">New Password</label>
                            <Field
                                type="password"
                                id="newPassword"
                                className="text-input"
                                name="newPassword"
                            />
                            <ErrorMessage component="p" name="newPassword" className="form-error" />
                        </div>

                        <div className="input-group">
                            <label className="input-label" htmlFor="confirmNewPassword">Confirm New Password</label>
                            <Field
                                type="password"
                                id="confirmNewPassword"
                                className="text-input"
                                name="confirmNewPassword"
                            />
                            <ErrorMessage component="p" name="confirmNewPassword" className="form-error" />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-primary btn-full"
                        >
                            {isSubmitting ? "Please Wait..." : "Change Password"}
                        </button>
                    </Form>
                </div>
            )}
        </Formik>
    )
}