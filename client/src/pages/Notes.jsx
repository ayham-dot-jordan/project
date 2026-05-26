import { useEffect, useRef, useState } from "react"
import DashboardLayout from "../components/DashboardLayout"
import api from "../api/axios"

function Notes() {
  const [notes, setNotes] = useState([])
  const [courses, setCourses] = useState([])
  const [serverError, setServerError] = useState("")
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    course: "",
  })

  const [editingId, setEditingId] = useState(null)
  const formRef = useRef(null)
  const [searchText, setSearchText] = useState("")

  const getNotes = async () => {
    try {
      setLoading(true)
      const response = await api.get("/notes")
      setNotes(response.data)
    } catch (error) {
      setServerError(error.response?.data?.message || "Failed to load notes")
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
    getNotes()
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
      content: "",
      course: "",
    })

    setEditingId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title) {
      alert("Note title is required")
      return
    }

    if (!formData.content) {
      alert("Note content is required")
      return
    }

    try {
      setServerError("")

      const noteData = {
        title: formData.title,
        content: formData.content,
        course: formData.course || null,
      }

      if (editingId) {
        const response = await api.put(`/notes/${editingId}`, noteData)

        const updatedNotes = notes.map((note) => {
          if (note._id === editingId) {
            return response.data
          }

          return note
        })

        setNotes(updatedNotes)
        clearForm()
      } else {
        const response = await api.post("/notes", noteData)
        setNotes([response.data, ...notes])
        clearForm()
      }
    } catch (error) {
      setServerError(error.response?.data?.message || "Something went wrong")
    }
  }

  const handleEdit = (note) => {
    setEditingId(note._id)

    setFormData({
      title: note.title,
      content: note.content,
      course: note.course?._id || "",
    })

    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }, 100)
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this note")

    if (confirmDelete) {
      try {
        await api.delete(`/notes/${id}`)

        const filteredNotes = notes.filter((note) => note._id !== id)
        setNotes(filteredNotes)
      } catch (error) {
        setServerError(error.response?.data?.message || "Failed to delete note")
      }
    }
  }

  const getCourseName = (note) => {
    return note.course ? note.course.title : "No course"
  }

  const filteredNotes = notes.filter((note) => {
    const searchValue = searchText.toLowerCase()
    const courseName = getCourseName(note).toLowerCase()

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

      {serverError && <div className="server-error">{serverError}</div>}

      <div className="content-card" ref={formRef}>
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
            <select name="course" value={formData.course} onChange={handleChange}>
              <option value="">Select course</option>

              {courses.map((course) => (
                <option value={course._id} key={course._id}>
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

          <div className="form-buttons">
            <button type="submit" className="full-button">
              {editingId ? "Update Note" : "Save Note"}
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
        <h2>My Notes</h2>

        <div className="filters-row notes-search">
          <input
            type="text"
            placeholder="Search notes"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {loading ? (
          <p>Loading notes</p>
        ) : (
          <div className="cards-grid">
            {filteredNotes.length === 0 ? (
              <p>No notes found</p>
            ) : (
              filteredNotes.map((note) => (
                <div className="item-card" key={note._id}>
                  <h3>{note.title}</h3>

                  <p>
                    <strong>Course:</strong> {getCourseName(note)}
                  </p>

                  <p>{note.content}</p>

                  <div className="card-actions">
                    <button onClick={() => handleEdit(note)} className="edit-button">
                      Edit
                    </button>

                    <button onClick={() => handleDelete(note._id)} className="delete-button">
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

export default Notes