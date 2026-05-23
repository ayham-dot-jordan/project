import { useState } from "react"
import DashboardLayout from "../components/DashboardLayout"

function Notes() {
  const courses = [
    { id: 1, title: "React" },
    { id: 2, title: "Backend" },
    { id: 3, title: "Database" },
  ]

  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "React notes",
      content: "Components are used to split the UI into reusable parts",
      courseId: 1,
    },
    {
      id: 2,
      title: "MongoDB notes",
      content: "MongoDB stores data as documents inside collections",
      courseId: 3,
    },
  ])

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    courseId: "",
  })

  const [editingId, setEditingId] = useState(null)
  const [searchText, setSearchText] = useState("")

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.title) {
      alert("Note title is required")
      return
    }

    if (!formData.content) {
      alert("Note content is required")
      return
    }

    if (editingId) {
      const updatedNotes = notes.map((note) => {
        if (note.id === editingId) {
          return {
            ...note,
            title: formData.title,
            content: formData.content,
            courseId: Number(formData.courseId),
          }
        }

        return note
      })

      setNotes(updatedNotes)
      setEditingId(null)
    } else {
      const newNote = {
        id: Date.now(),
        title: formData.title,
        content: formData.content,
        courseId: Number(formData.courseId),
      }

      setNotes([...notes, newNote])
    }

    setFormData({
      title: "",
      content: "",
      courseId: "",
    })
  }

  const handleEdit = (note) => {
    setEditingId(note.id)

    setFormData({
      title: note.title,
      content: note.content,
      courseId: note.courseId,
    })
  }

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this note")

    if (confirmDelete) {
      const filteredNotes = notes.filter((note) => note.id !== id)
      setNotes(filteredNotes)
    }
  }

  const getCourseName = (courseId) => {
    const course = courses.find((course) => course.id === Number(courseId))
    return course ? course.title : "No course"
  }

  const filteredNotes = notes.filter((note) => {
    const searchValue = searchText.toLowerCase()
    const courseName = getCourseName(note.courseId).toLowerCase()

    return (
      note.title.toLowerCase().includes(searchValue) ||
      note.content.toLowerCase().includes(searchValue) ||
      courseName.includes(searchValue)
    )
  })

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>Notes</h1>
        <p>Add and manage your study notes</p>
      </div>

      <div className="content-card">
        <h2>{editingId ? "Edit Note" : "Add Note"}</h2>

        <form onSubmit={handleSubmit} className="simple-form">
          <div className="form-group">
            <label>Note Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter note title"
              value={formData.title}
              onChange={handleChange}
            />
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

          <div className="form-group">
            <label>Content</label>
            <textarea
              name="content"
              placeholder="Write your note here"
              value={formData.content}
              onChange={handleChange}
            ></textarea>
          </div>

          <button type="submit" className="full-button">
            {editingId ? "Update Note" : "Save Note"}
          </button>
        </form>
      </div>

      <div className="content-card">
        <h2>My Notes</h2>

        <div className="filters-row notes-search">
          <input
            type="text"
            placeholder="Search notes"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div className="cards-grid">
          {filteredNotes.length === 0 ? (
            <p>No notes found</p>
          ) : (
            filteredNotes.map((note) => (
              <div className="item-card" key={note.id}>
                <h3>{note.title}</h3>
                <p>
                  <strong>Course:</strong> {getCourseName(note.courseId)}
                </p>
                <p>{note.content}</p>

                <div className="card-actions">
                  <button onClick={() => handleEdit(note)} className="edit-button">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(note.id)} className="delete-button">
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

export default Notes