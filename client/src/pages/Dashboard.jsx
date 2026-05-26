import { useEffect, useState } from "react"
import DashboardLayout from "../components/DashboardLayout"
import api from "../api/axios"

function Dashboard() {
  const [courses, setCourses] = useState([])
  const [tasks, setTasks] = useState([])
  const [notes, setNotes] = useState([])
  const [serverError, setServerError] = useState("")
  const [loading, setLoading] = useState(true)

  const getDashboardData = async () => {
    try {
      setLoading(true)

      const coursesResponse = await api.get("/courses")
      const tasksResponse = await api.get("/tasks")
      const notesResponse = await api.get("/notes")

      setCourses(coursesResponse.data)
      setTasks(tasksResponse.data)
      setNotes(notesResponse.data)
    } catch (error) {
      setServerError("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getDashboardData()
  }, [])

  const completedTasks = tasks.filter((task) => task.status === "Completed")

  const recentTasks = tasks.slice(0, 3)
  const recentNotes = notes.slice(0, 3)

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back, here is a quick look at your study progress</p>
      </div>

      {serverError && <div className="server-error">{serverError}</div>}

      {loading ? (
        <div className="content-card">
          <p>Loading dashboard</p>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Courses</h3>
              <p>{courses.length}</p>
            </div>

            <div className="stat-card">
              <h3>Total Tasks</h3>
              <p>{tasks.length}</p>
            </div>

            <div className="stat-card">
              <h3>Completed Tasks</h3>
              <p>{completedTasks.length}</p>
            </div>

            <div className="stat-card">
              <h3>Total Notes</h3>
              <p>{notes.length}</p>
            </div>
          </div>

          <div className="content-card">
            <h2>Recent Tasks</h2>

            {recentTasks.length === 0 ? (
              <p>No tasks added yet</p>
            ) : (
              <div className="mini-list">
                {recentTasks.map((task) => (
                  <div className="mini-list-item" key={task._id}>
                    <div>
                      <h4>{task.title}</h4>
                      <p>{task.status}</p>
                    </div>

                    <span>{task.priority}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="content-card">
            <h2>Recent Notes</h2>

            {recentNotes.length === 0 ? (
              <p>No notes added yet</p>
            ) : (
              <div className="mini-list">
                {recentNotes.map((note) => (
                  <div className="mini-list-item" key={note._id}>
                    <div>
                      <h4>{note.title}</h4>
                      <p>{note.content.slice(0, 60)}</p>
                    </div>

                    <span>Note</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  )
}

export default Dashboard