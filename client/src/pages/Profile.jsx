import { Link, useNavigate } from "react-router-dom"
import DashboardLayout from "../components/DashboardLayout"

function Profile() {
  const navigate = useNavigate()

  const user = {
    name: "Ayham Mhedat",
    email: "ayham@example.com",
    createdAt: "2026-05-20",
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>Profile</h1>
        <p>View your account information</p>
      </div>

      <div className="content-card profile-card">
        <h2>User Information</h2>

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
            <p>{user.createdAt}</p>
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
      </div>
    </DashboardLayout>
  )
}

export default Profile