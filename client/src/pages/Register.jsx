import { Link, useNavigate } from "react-router-dom"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useState } from "react"
import api from "../api/axios"

function Register() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  }

  const validationSchema = Yup.object({
    name: Yup.string().required("Full name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
  })

  const handleSubmit = async (values) => {
    try {
      setServerError("")

      await api.post("/auth/register", {
        name: values.name,
        email: values.email,
        password: values.password,
      })

      navigate("/login")
    } catch (error) {
      setServerError(error.response?.data?.message || "Register failed")
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">
          StudyHub
        </Link>

        <h1>Create Account</h1>
        <p className="auth-text">Create your account and start organizing your study work</p>

        {serverError && <div className="server-error">{serverError}</div>}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <Field type="text" name="name" placeholder="Enter your full name" />
              <ErrorMessage name="name" component="div" className="error" />
            </div>

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

            <div className="form-group">
              <label>Confirm Password</label>

              <div className="password-field">
                <Field
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="password-toggle"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>

              <ErrorMessage name="confirmPassword" component="div" className="error" />
            </div>

            <button type="submit" className="full-button">
              Register
            </button>
          </Form>
        </Formik>

        <p className="auth-bottom">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register