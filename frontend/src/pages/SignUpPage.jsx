import { Link, useNavigate } from "react-router-dom"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { toast } from "react-toastify"
import * as Yup from "yup"
import Footer from "../components/Footer"
import axios from "../utils/axios"

const validationSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, "Name must be at least 2 characters")
        .max(30, "Name must be within 30 characters")
        .required("Name is required"),

    email: Yup.string()
        .email(2, "Invalid email")
        .max(30, "Email must be within 30 characters")
        .required("Email is required"),

    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .max(20, "Password must be within 20 characters")
        .required("Password is required"),

    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Password does not match")
        .required("Please confirm your password")
})

export default function SignUpPage() {
    const navigate = useNavigate()

    const handleSubmit = async (values, { setSubmitting }) => {
        setSubmitting(true)

        try {
            const { data } = await axios.post("/auth/create-account", values)
            localStorage.setItem("jwtToken", data.jwtToken)
            toast.success("Sign up successfull")
            navigate("/")
        } catch ({ response }) {
            response?.status === 422 && toast.error("Email already taken")
        }

        setSubmitting(false)
    }

    return (
        <Formik
            initialValues={{
                name: "",
                email: "",
                password: "",
                confirmPassword: ""
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting }) => (
                <Form className="form-card" style={{ marginTop: 40 }}>
                    <div className="header">Sign Up</div>

                    <div className="body">
                        <div className="input-group">
                            <label className="input-label" htmlFor="name">Name</label>
                            <Field
                                type="text"
                                id="name"
                                className="text-input"
                                name="name"
                            />
                            <ErrorMessage component="p" name="name" className="form-error" />
                        </div>

                        <div className="input-group">
                            <label className="input-label" htmlFor="email">Email</label>
                            <Field
                                type="email"
                                id="email"
                                className="text-input"
                                name="email"
                            />
                            <ErrorMessage component="p" name="email" className="form-error" />
                        </div>

                        <div className="input-group">
                            <label className="input-label" htmlFor="password">Password</label>
                            <Field
                                type="password"
                                id="password"
                                className="text-input"
                                name="password"
                            />
                            <ErrorMessage component="p" name="password" className="form-error" />
                        </div>

                        <div className="input-group">
                            <label className="input-label" htmlFor="confirmPassword">Confirm Password</label>
                            <Field
                                type="password"
                                id="confirmPassword"
                                className="text-input"
                                name="confirmPassword"
                            />
                            <ErrorMessage component="p" name="confirmPassword" className="form-error" />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-primary btn-full"
                        >
                            {isSubmitting ? "Please Wait..." : "Sign Up"}
                        </button>

                        <p className="auth-link">
                            Already have an account ? <Link to="/login">Login</Link>
                        </p>
                    </div>

                    <Footer />
                </Form>
            )}
        </Formik>
    )
}