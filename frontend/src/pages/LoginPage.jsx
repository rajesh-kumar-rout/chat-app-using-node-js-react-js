import { Link, useNavigate } from "react-router-dom"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { toast } from "react-toastify"
import * as Yup from "yup"
import axios from "../utils/axios"
import Footer from "../components/Footer"

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email")
        .required("Email is required"),

    password: Yup.string().required("Password is required")
})

export default function LoginPage() {
    const navigate = useNavigate()

    const handleSubmit = async (values, { setSubmitting }) => {
        setSubmitting(true)

        try {
            const { data } = await axios.post("/auth/login", values)
            localStorage.setItem("jwtToken", data.jwtToken)
            navigate("/", { replace: true })

        } catch ({ response }) {
            response?.status === 422 && toast.error("Invalid email or password")
        }

        setSubmitting(false)
    }

    return (
        <Formik
            initialValues={{
                email: "",
                password: ""
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting }) => (
                <div className="form-card" style={{ marginTop: 40 }}>
                    <div className="header">Login</div>

                    <Form className="body">
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

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-primary btn-full"
                        >
                            {isSubmitting ? "Please Wait..." : "Login"}
                        </button>

                        <p className="auth-link">
                            Do not have account ? <Link to="/create-account">Create account</Link>
                        </p>
                    </Form>

                    <Footer />
                </div>
            )}
        </Formik>
    )
}