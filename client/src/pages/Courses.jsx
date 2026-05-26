import { useEffect, useState } from "react"
import DashboardLayout from "../components/DashboardLayout"
import api from "../api/axios"

function Courses() {
  const [courses, setCourses] = useState([])
  const [serverError, setServerError] = useState("")
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    title: "",
    instructor: "",
    description: "",
  })

  const [editingId, setEditingId] = useState(null)

  const getCourses = async () => {
    try {
      setLoading(true)
      const response = await api.get("/courses")
      setCourses(response.data)
    } catch (error) {
      setServerError(error.response?.data?.message || "Failed to load courses")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getCourses()
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title) {
      alert("Course title is required")
      return
    }

    try {
      setServerError("")

      if (editingId) {
        const response = await api.put(`/courses/${editingId}`, formData)

        const updatedCourses = courses.map((course) => {
          if (course._id === editingId) {
            return response.data
          }

          return course
        })

        setCourses(updatedCourses)
        setEditingId(null)
      } else {
        const response = await api.post("/courses", formData)
        setCourses([response.data, ...courses])
      }

      setFormData({
        title: "",
        instructor: "",
        description: "",
      })
    } catch (error) {
      setServerError(error.response?.data?.message || "Something went wrong")
    }
  }

  const handleEdit = (course) => {
    setEditingId(course._id)

    setFormData({
      title: course.title,
      instructor: course.instructor,
      description: course.description,
    })
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this course")

    if (confirmDelete) {
      try {
        await api.delete(`/courses/${id}`)

        const filteredCourses = courses.filter((course) => course._id !== id)
        setCourses(filteredCourses)
      } catch (error) {
        setServerError(error.response?.data?.message || "Failed to delete course")
      }
    }
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>Courses</h1>
        <p>Add and manage your study courses</p>
      </div>

      {serverError && <div className="server-error">{serverError}</div>}

      <div className="content-card">
        <h2>{editingId ? "Edit Course" : "Add Course"}</h2>

        <form onSubmit={handleSubmit} className="simple-form">
          <div className="form-group">
            <label>Course Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter course title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Instructor</label>
            <input
              type="text"
              name="instructor"
              placeholder="Enter instructor name"
              value={formData.instructor}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Enter course description"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <button type="submit" className="full-button">
            {editingId ? "Update Course" : "Save Course"}
          </button>
        </form>
      </div>

      <div className="content-card">
        <h2>My Courses</h2>

        {loading ? (
          <p>Loading courses</p>
        ) : (
          <div className="cards-grid">
            {courses.length === 0 ? (
              <p>No courses added yet</p>
            ) : (
              courses.map((course) => (
                <div className="item-card" key={course._id}>
                  <h3>{course.title}</h3>

                  <p>
                    <strong>Instructor:</strong> {course.instructor || "Not added"}
                  </p>

                  <p>{course.description || "No description added"}</p>

                  <div className="card-actions">
                    <button onClick={() => handleEdit(course)} className="edit-button">
                      Edit
                    </button>

                    <button onClick={() => handleDelete(course._id)} className="delete-button">
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

export default Courses