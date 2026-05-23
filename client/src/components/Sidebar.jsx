import { Link, useNavigate } from "react-router-dom"

function Sidebar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <div className="sidebar">
      <h2 className="sidebar-logo">StudyHub</h2>

      <div className="sidebar-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/courses">Courses</Link>
        <Link to="/tasks">Tasks</Link>
        <Link to="/notes">Notes</Link>
        <Link to="/profile">Profile</Link>
      </div>

      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  )
}

export default Sidebar