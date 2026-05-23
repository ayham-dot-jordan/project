import { Link } from "react-router-dom"

function Landing() {
  return (
    <div>
      <nav className="navbar">
        <Link to="/" className="logo">
          StudyHub
        </Link>

        <div className="nav-links">
          <Link to="/login" className="nav-link">
            Login
          </Link>
          <Link to="/register" className="nav-button">
            Register
          </Link>
        </div>
      </nav>

      <section className="hero">
        <h1>Keep your study work organized</h1>
        <p>
          StudyHub helps students manage courses, tasks, notes, and deadlines in
          one simple place
        </p>

        <div className="hero-buttons">
          <Link to="/register" className="primary-button">
            Start Organizing
          </Link>
          <Link to="/login" className="secondary-button">
            Login
          </Link>
        </div>
      </section>

      <section className="features">
        <h2>Why StudyHub</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>Keep everything together</h3>
            <p>Courses, tasks, and notes stay organized in one account</p>
          </div>

          <div className="feature-card">
            <h3>Track deadlines</h3>
            <p>Add tasks with priority and status so you know what to finish</p>
          </div>

          <div className="feature-card">
            <h3>See your progress</h3>
            <p>Use the dashboard to view your courses, tasks, and notes</p>
          </div>
        </div>
      </section>

      <section className="example-section">
        <div className="example-text">
          <h2>Example study tasks</h2>
          <p>This is the type of work a student can organize after signing up</p>
        </div>

        <div className="example-list">
          <div className="example-item">
            <span>React Project</span>
            <small>High | In Progress</small>
          </div>

          <div className="example-item">
            <span>MongoDB Notes</span>
            <small>Medium | Pending</small>
          </div>

          <div className="example-item">
            <span>Final Review</span>
            <small>High | Completed</small>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>StudyHub © 2026</p>
      </footer>
    </div>
  )
}

export default Landing