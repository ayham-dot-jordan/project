import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import DashboardLayout from "../components/DashboardLayout"
import api from "../api/axios"

function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [serverError, setServerError] = useState("")

  const getProfile = async () => {
    try {
      const response = await api.get("/auth/profile")
      setUser(response.data)
    } catch (error) {
      setServerError("Failed to load profile")
    }
  }

  useEffect(() => {
    getProfile()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>Profile</h1>
        <p>View your account information</p>
      </div>

      {serverError && <div className="server-error">{serverError}</div>}

      <div className="content-card profile-card">
        <h2>User Information</h2>

        {!user ? (
          <p>Loading profile</p>
        ) : (
          <>
            <div className="profile-info">
              <div>
                <span>Full Name</span>
                <p>{user.name}</p>
              </div>

              <div>
                <span>Email</span>
                <p>{user.email}</p>
              </div>

              <div>
                <span>Account Created</span>
                <p>{user.createdAt ? user.createdAt.slice(0, 10) : "Not available"}</p>
              </div>
            </div>

            <div className="profile-actions">
              <Link to="/dashboard" className="secondary-link-button">
                Back to Dashboard
              </Link>

              <button onClick={handleLogout} className="delete-button">
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

export default Profile