import DashboardLayout from "../components/DashboardLayout"

function Dashboard() {
  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back, here is a quick look at your study progress</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Courses</h3>
          <p>3</p>
        </div>

        <div className="stat-card">
          <h3>Total Tasks</h3>
          <p>8</p>
        </div>

        <div className="stat-card">
          <h3>Completed Tasks</h3>
          <p>4</p>
        </div>

        <div className="stat-card">
          <h3>Total Notes</h3>
          <p>5</p>
        </div>
      </div>

      <div className="content-card">
        <h2>Recent Tasks</h2>
        <p>No tasks added yet</p>
      </div>

      <div className="content-card">
        <h2>Recent Notes</h2>
        <p><p>No notes added yet</p></p>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard