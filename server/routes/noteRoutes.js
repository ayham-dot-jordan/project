const express = require("express")
const Note = require("../models/Note")
const protect = require("../middleware/authMiddleware")

const router = express.Router()

router.get("/", protect, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id })
      .populate("course", "title")
      .sort({ createdAt: -1 })

    res.json(notes)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

router.post("/", protect, async (req, res) => {
  try {
    const { title, content, course } = req.body

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" })
    }

    const note = await Note.create({
      title,
      content,
      course: course || null,
      user: req.user._id,
    })

    res.status(201).json(note)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

router.put("/:id", protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)

    if (!note) {
      return res.status(404).json({ message: "Note not found" })
    }

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" })
    }

    const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })

    res.json(updatedNote)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

router.delete("/:id", protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)

    if (!note) {
      return res.status(404).json({ message: "Note not found" })
    }

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" })
    }

    await Note.findByIdAndDelete(req.params.id)

    res.json({ message: "Note deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router