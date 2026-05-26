import { Link, useNavigate } from "react-router-dom"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useState } from "react"
import api from "../api/axios"

function Login() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const initialValues = {
    email: "",
    password: "",
  }

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  })

  const handleSubmit = async (values) => {
    try {
      setServerError("")

      const response = await api.post("/auth/login", values)

      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))

      navigate("/dashboard")
    } catch (error) {
      setServerError(error.response?.data?.message || "Login failed")
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">
          StudyHub
        </Link>

        <h1>Login</h1>
        <p className="auth-text">Login to continue organizing your study work</p>

        {serverError && <div className="server-error">{serverError}</div>}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <Field type="email" name="email" placeholder="Enter your email" />
              <ErrorMessage name="email" component="div" className="error" />
            </div>

            <div className="form-group">
              <label>Password</label>

              <div className="password-field">
                <Field
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <ErrorMessage name="password" component="div" className="error" />
            </div>

            <button type="submit" className="full-button">
              Login
            </button>
          </Form>
        </Formik>

        <p className="auth-bottom">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  )
}

export default Login