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

  const getTaskCourseId = (task) => {
    if (!task.course) {
      return null
    }

    if (typeof task.course === "string") {
      return task.course
    }

    return task.course._id
  }

  const getCourseProgress = (courseId) => {
    const courseTasks = tasks.filter((task) => getTaskCourseId(task) === courseId)

    if (courseTasks.length === 0) {
      return {
        progress: 0,
        completed: 0,
        total: 0,
      }
    }

    const completedCourseTasks = courseTasks.filter(
      (task) => task.status === "Completed"
    )

    return {
      progress: Math.round((completedCourseTasks.length / courseTasks.length) * 100),
      completed: completedCourseTasks.length,
      total: courseTasks.length,
    }
  }

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
            <h2>Course Progress</h2>

            {courses.length === 0 ? (
              <p>No courses added yet</p>
            ) : (
              <div className="progress-list">
                {courses.map((course) => {
                  const courseProgress = getCourseProgress(course._id)

                  return (
                    <div className="progress-item" key={course._id}>
                      <div className="progress-info">
                        <div>
                          <h4>{course.title}</h4>
                          <p>
                            {courseProgress.completed} of {courseProgress.total} tasks completed
                          </p>
                        </div>

                        <span>{courseProgress.progress}%</span>
                      </div>

                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${courseProgress.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
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
                      <h4>{task.title || "Untitled task"}</h4>
                      <p>{task.status || "Pending"}</p>
                    </div>

                    <span>{task.priority || "Medium"}</span>
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
                      <h4>{note.title || "Untitled note"}</h4>
                      <p>{note.content ? note.content.slice(0, 60) : "No content added"}</p>
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