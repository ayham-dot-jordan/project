const express = require("express")
const Course = require("../models/Course")
const protect = require("../middleware/authMiddleware")

const router = express.Router()

router.get("/", protect, async (req, res) => {
  try {
    const courses = await Course.find({ user: req.user._id }).sort({
      createdAt: -1,
    })

    res.json(courses)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

router.post("/", protect, async (req, res) => {
  try {
    const { title, instructor, description } = req.body

    if (!title) {
      return res.status(400).json({ message: "Course title is required" })
    }

    const course = await Course.create({
      title,
      instructor,
      description,
      user: req.user._id,
    })

    res.status(201).json(course)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

router.put("/:id", protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)

    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    if (course.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" })
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.json(updatedCourse)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

router.delete("/:id", protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)

    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    if (course.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" })
    }

    await Course.findByIdAndDelete(req.params.id)

    res.json({ message: "Course deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router