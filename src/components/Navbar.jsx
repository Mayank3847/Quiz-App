import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState("any");
  const navigate = useNavigate();

  const handleStart = () => {
    const settings = { numQuestions, difficulty };
    localStorage.setItem("quizSettings", JSON.stringify(settings));
    navigate("/quiz");
  };

  return (
    <div className="home-container">
      {/* White Navbar (keep this one only) */}
      <nav className="navbar">
        <div className="navbar-content">
          <h1 className="logo">🧠 Quiz Challenge</h1>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/quiz">Quiz</Link>
            <Link to="/results">Results</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="main">
        <div className="card">
          <div className="icon">🧠</div>
          <h2>Ready to Test Your Knowledge?</h2>
          <p className="subtitle">
            Challenge yourself with carefully selected questions from various topics.
          </p>

          {/* Features */}
          <div className="features">
            <span>⏱ No time limit</span>
            <span>📋 {numQuestions} questions</span>
            <span>🏆 Score tracking</span>
          </div>

          {/* Form */}
          <div className="form">
            <div className="form-group">
              <label>Number of Questions</label>
              <select
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
              >
                <option value="5">5 Questions</option>
                <option value="10">10 Questions</option>
                <option value="15">15 Questions</option>
                <option value="20">20 Questions</option>
              </select>
            </div>

            <div className="form-group">
              <label>Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="any">Any Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Start Button */}
          <button className="start-btn" onClick={handleStart}>
            Start Quiz 🚀
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
