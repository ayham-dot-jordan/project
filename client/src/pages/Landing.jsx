import { Link } from "react-router-dom";

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
        <h1>Organize Your Study Life in One Place</h1>
        <p>
          StudyHub helps students manage courses, tasks, notes, and deadlines
          from one simple dashboard
        </p>

        <div className="hero-buttons">
          <Link to="/register" className="primary-button">
            Get Started
          </Link>
          <Link to="/login" className="secondary-button">
            Login
          </Link>
        </div>
      </section>

      <section className="features">
        <h2>Main Features</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>Courses</h3>
            <p>
              Add your courses and keep your study subjects organized in one
              place
            </p>
          </div>

          <div className="feature-card">
            <h3>Tasks</h3>
            <p>
              Create tasks, set priorities, add deadlines, and track your
              progress
            </p>
          </div>

          <div className="feature-card">
            <h3>Notes</h3>
            <p>
              Save important notes for each course and search them when needed
            </p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>StudyHub © 2026</p>
      </footer>
    </div>
  );
}

export default Landing;