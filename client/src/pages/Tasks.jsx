import { useState } from "react"
import DashboardLayout from "../components/DashboardLayout"

function Tasks() {
  const courses = [
    { id: 1, title: "React" },
    { id: 2, title: "Backend" },
    { id: 3, title: "Database" },
  ]

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Finish React components",
      description: "Complete the main pages and layout",
      courseId: 1,
      priority: "High",
      status: "In Progress",
      dueDate: "2026-05-25",
    },
    {
      id: 2,
      title: "Review MongoDB notes",
      description: "Study database collections and documents",
      courseId: 3,
      priority: "Medium",
      status: "Pending",
      dueDate: "2026-05-28",
    },
  ])

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseId: "",
    priority: "Medium",
    status: "Pending",
    dueDate: "",
  })

  const [editingId, setEditingId] = useState(null)
  const [searchText, setSearchText] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.title) {
      alert("Task title is required")
      return
    }

    if (editingId) {
      const updatedTasks = tasks.map((task) => {
        if (task.id === editingId) {
          return {
            ...task,
            title: formData.title,
            description: formData.description,
            courseId: Number(formData.courseId),
            priority: formData.priority,
            status: formData.status,
            dueDate: formData.dueDate,
          }
        }

        return task
      })

      setTasks(updatedTasks)
      setEditingId(null)
    } else {
      const newTask = {
        id: Date.now(),
        title: formData.title,
        description: formData.description,
        courseId: Number(formData.courseId),
        priority: formData.priority,
        status: formData.status,
        dueDate: formData.dueDate,
      }

      setTasks([...tasks, newTask])
    }

    setFormData({
      title: "",
      description: "",
      courseId: "",
      priority: "Medium",
      status: "Pending",
      dueDate: "",
    })
  }

  const handleEdit = (task) => {
    setEditingId(task.id)

    setFormData({
      title: task.title,
      description: task.description,
      courseId: task.courseId,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
    })
  }

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task")

    if (confirmDelete) {
      const filteredTasks = tasks.filter((task) => task.id !== id)
      setTasks(filteredTasks)
    }
  }

  const handleComplete = (id) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return {
          ...task,
          status: "Completed",
        }
      }

      return task
    })

    setTasks(updatedTasks)
  }

  const getCourseName = (courseId) => {
    const course = courses.find((course) => course.id === Number(courseId))
    return course ? course.title : "No course"
  }

  const filteredTasks = tasks.filter((task) => {
    const searchValue = searchText.toLowerCase()
    const courseName = getCourseName(task.courseId).toLowerCase()

    const matchesSearch =
      task.title.toLowerCase().includes(searchValue) ||
      task.description.toLowerCase().includes(searchValue) ||
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

      <div className="content-card">
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
            <select name="courseId" value={formData.courseId} onChange={handleChange}>
              <option value="">Select course</option>
              {courses.map((course) => (
                <option value={course.id} key={course.id}>
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

          <button type="submit" className="full-button">
            {editingId ? "Update Task" : "Save Task"}
          </button>
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

        <div className="cards-grid">
          {filteredTasks.length === 0 ? (
            <p>No tasks found</p>
          ) : (
            filteredTasks.map((task) => (
              <div className="item-card" key={task.id}>
                <h3>{task.title}</h3>
                <p>{task.description || "No description added"}</p>
                <p>
                  <strong>Course:</strong> {getCourseName(task.courseId)}
                </p>
                <p>
                  <strong>Priority:</strong> {task.priority}
                </p>
                <p>
                  <strong>Status:</strong> {task.status}
                </p>
                <p>
                  <strong>Due Date:</strong> {task.dueDate || "No due date"}
                </p>

                <div className="card-actions">
                  <button onClick={() => handleComplete(task.id)} className="complete-button">
                    Complete
                  </button>
                  <button onClick={() => handleEdit(task)} className="edit-button">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(task.id)} className="delete-button">
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Tasks