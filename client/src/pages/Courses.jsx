import { useState } from "react"
import DashboardLayout from "../components/DashboardLayout"

function Courses() {
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "React",
      instructor: "Course instructor",
      description: "Frontend course for building user interfaces",
    },
    {
      id: 2,
      title: "Backend",
      instructor: "Course instructor",
      description: "Node and Express course",
    },
  ])

  const [formData, setFormData] = useState({
    title: "",
    instructor: "",
    description: "",
  })

  const [editingId, setEditingId] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.title) {
      alert("Course title is required")
      return
    }

    if (editingId) {
      const updatedCourses = courses.map((course) => {
        if (course.id === editingId) {
          return {
            ...course,
            title: formData.title,
            instructor: formData.instructor,
            description: formData.description,
          }
        }

        return course
      })

      setCourses(updatedCourses)
      setEditingId(null)
    } else {
      const newCourse = {
        id: Date.now(),
        title: formData.title,
        instructor: formData.instructor,
        description: formData.description,
      }

      setCourses([...courses, newCourse])
    }

    setFormData({
      title: "",
      instructor: "",
      description: "",
    })
  }

  const handleEdit = (course) => {
    setEditingId(course.id)
    setFormData({
      title: course.title,
      instructor: course.instructor,
      description: course.description,
    })
  }

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this course")

    if (confirmDelete) {
      const filteredCourses = courses.filter((course) => course.id !== id)
      setCourses(filteredCourses)
    }
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>Courses</h1>
        <p>Add and manage your study courses</p>
      </div>

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

        <div className="cards-grid">
          {courses.length === 0 ? (
            <p>No courses added yet</p>
          ) : (
            courses.map((course) => (
              <div className="item-card" key={course.id}>
                <h3>{course.title}</h3>
                <p>
                  <strong>Instructor:</strong> {course.instructor || "Not added"}
                </p>
                <p>{course.description || "No description added"}</p>

                <div className="card-actions">
                  <button onClick={() => handleEdit(course)} className="edit-button">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(course.id)} className="delete-button">
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

export default Courses