import { useEffect, useRef, useState } from "react"
import DashboardLayout from "../components/DashboardLayout"
import api from "../api/axios"

function Tasks() {
  const [tasks, setTasks] = useState([])
  const [courses, setCourses] = useState([])
  const [serverError, setServerError] = useState("")
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    course: "",
    priority: "Medium",
    status: "Pending",
    dueDate: "",
  })

  const [editingId, setEditingId] = useState(null)
  const formRef = useRef(null)

  const [searchText, setSearchText] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")

  const getTasks = async () => {
    try {
      setLoading(true)
      const response = await api.get("/tasks")
      setTasks(response.data)
    } catch (error) {
      setServerError(error.response?.data?.message || "Failed to load tasks")
    } finally {
      setLoading(false)
    }
  }

  const getCourses = async () => {
    try {
      const response = await api.get("/courses")
      setCourses(response.data)
    } catch (error) {
      setServerError(error.response?.data?.message || "Failed to load courses")
    }
  }

  useEffect(() => {
    getTasks()
    getCourses()
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const clearForm = () => {
    setFormData({
      title: "",
      description: "",
      course: "",
      priority: "Medium",
      status: "Pending",
      dueDate: "",
    })

    setEditingId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      alert("Task title is required")
      return
    }

    try {
      setServerError("")

      const taskData = {
        title: formData.title,
        description: formData.description,
        course: formData.course || null,
        priority: formData.priority,
        status: formData.status,
        dueDate: formData.dueDate || null,
      }

      if (editingId) {
        await api.put(`/tasks/${editingId}`, taskData)
      } else {
        await api.post("/tasks", taskData)
      }

      await getTasks()
      clearForm()
    } catch (error) {
      setServerError(error.response?.data?.message || "Something went wrong")
    }
  }

  const handleEdit = (task) => {
    setEditingId(task._id)

    setFormData({
      title: task.title || "",
      description: task.description || "",
      course: typeof task.course === "string" ? task.course : task.course?._id || "",
      priority: task.priority || "Medium",
      status: task.status || "Pending",
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
    })

    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }, 100)
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task")

    if (!confirmDelete) {
      return
    }

    try {
      await api.delete(`/tasks/${id}`)
      await getTasks()
    } catch (error) {
      setServerError(error.response?.data?.message || "Failed to delete task")
    }
  }

  const handleComplete = async (id) => {
    try {
      await api.patch(`/tasks/${id}/complete`)
      await getTasks()
    } catch (error) {
      setServerError(error.response?.data?.message || "Failed to complete task")
    }
  }

  const getCourseName = (task) => {
    if (!task.course) {
      return "No course"
    }

    if (typeof task.course === "string") {
      const foundCourse = courses.find((course) => course._id === task.course)
      return foundCourse ? foundCourse.title : "No course"
    }

    return task.course.title || "No course"
  }

  const filteredTasks = tasks.filter((task) => {
    const searchValue = searchText.toLowerCase()
    const courseName = getCourseName(task).toLowerCase()
    const title = task.title || ""
    const description = task.description || ""

    const matchesSearch =
      title.toLowerCase().includes(searchValue) ||
      description.toLowerCase().includes(searchValue) ||
      courseName.includes(searchValue)

    const matchesPriority = priorityFilter === "All" || task.priority === priorityFilter
    const matchesStatus = statusFilter === "All" || task.status === statusFilter

    return matchesSearch && matchesPriority && matchesStatus
  })

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>Tasks</h1>
        <p>Add and manage your study tasks</p>
      </div>

      {serverError && <div className="server-error">{serverError}</div>}

      <div className="content-card" ref={formRef}>
        <h2>{editingId ? "Edit Task" : "Add Task"}</h2>

        <form onSubmit={handleSubmit} className="simple-form">
          <div className="form-group">
            <label>Task Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter task title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Enter task description"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="form-group">
            <label>Course</label>
            <select name="course" value={formData.course} onChange={handleChange}>
              <option value="">Select course</option>

              {courses.map((course) => (
                <option value={course._id} key={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Priority</label>
              <select name="priority" value={formData.priority} onChange={handleChange}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className="full-button">
              {editingId ? "Update Task" : "Save Task"}
            </button>

            {editingId && (
              <button type="button" onClick={clearForm} className="cancel-button">
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="content-card">
        <h2>My Tasks</h2>

        <div className="filters-row">
          <input
            type="text"
            placeholder="Search tasks"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="All">All priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {loading ? (
          <p>Loading tasks</p>
        ) : (
          <div className="cards-grid">
            {filteredTasks.length === 0 ? (
              <p>No tasks found</p>
            ) : (
              filteredTasks.map((task) => (
                <div className="item-card" key={task._id}>
                  <h3>{task.title || "Untitled task"}</h3>
                  <p>{task.description || "No description added"}</p>

                  <p>
                    <strong>Course:</strong> {getCourseName(task)}
                  </p>

                  <p>
                    <strong>Priority:</strong> {task.priority || "Medium"}
                  </p>

                  <p>
                    <strong>Status:</strong> {task.status || "Pending"}
                  </p>

                  <p>
                    <strong>Due Date:</strong>{" "}
                    {task.dueDate ? task.dueDate.slice(0, 10) : "No due date"}
                  </p>

                  <div className="card-actions">
                    <button onClick={() => handleComplete(task._id)} className="complete-button">
                      Complete
                    </button>

                    <button onClick={() => handleEdit(task)} className="edit-button">
                      Edit
                    </button>

                    <button onClick={() => handleDelete(task._id)} className="delete-button">
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default Tasks