import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

function Home() {
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState("any");
  const [highScore, setHighScore] = useState(0);
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const savedHighScore = localStorage.getItem("highScore");
    const savedTotalQuizzes = localStorage.getItem("totalQuizzes");

    if (savedHighScore) setHighScore(parseInt(savedHighScore, 10));
    if (savedTotalQuizzes) setTotalQuizzes(parseInt(savedTotalQuizzes, 10));
  }, []);

  const handleStart = () => {
    const settings = { numQuestions, difficulty };
    localStorage.setItem("quizSettings", JSON.stringify(settings));

    const newTotal = totalQuizzes + 1;
    setTotalQuizzes(newTotal);
    localStorage.setItem("totalQuizzes", newTotal.toString());

    navigate("/quiz");
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case "easy":
        return "#28a745";
      case "medium":
        return "#ffc107";
      case "hard":
        return "#dc3545";
      default:
        return "#6f42c1";
    }
  };

  const getDifficultyIcon = (diff) => {
    switch (diff) {
      case "easy":
        return "😊";
      case "medium":
        return "🤔";
      case "hard":
        return "😰";
      default:
        return "🎲";
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Navigation */}
      <nav
        style={{
          background: "white",
          padding: "12px 0",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 16px",
            flexWrap: "wrap",
          }}
        >
          <h1
            style={{
              margin: "0 0 8px 0",
              fontSize: "20px",
              fontWeight: "bold",
              color: "#333",
              flex: "1 1 100%",
            }}
          >
            🧠 Quiz Challenge
          </h1>
          <div
            style={{
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Link
              to="/"
              style={{
                textDecoration: "none",
                color: "#007bff",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              Home
            </Link>
            <Link
              to="/quiz"
              style={{
                textDecoration: "none",
                color: "#6c757d",
                fontWeight: "500",
                fontSize: "14px",
              }}
            >
              Quiz
            </Link>
            <Link
              to="/results"
              style={{
                textDecoration: "none",
                color: "#6c757d",
                fontWeight: "500",
                fontSize: "14px",
              }}
            >
              Results
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "60px 16px",
          textAlign: "center",
          color: "white",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: "800px", margin: "0 auto" }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🧠</div>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              margin: "0 0 16px 0",
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            Ready to Test Your Knowledge?
          </h1>
          <p
            style={{
              fontSize: "16px",
              opacity: 0.9,
              lineHeight: "1.6",
              maxWidth: "500px",
              margin: "0 auto",
            }}
          >
            Challenge yourself with carefully selected questions from various
            topics. Track your progress and compete with your best scores!
          </p>
        </motion.div>
      </div>

      {/* Stats Section */}
      {(highScore > 0 || totalQuizzes > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{
            maxWidth: "1200px",
            margin: "-40px auto 0",
            padding: "0 16px",
            position: "relative",
            zIndex: 10,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: "16px",
              textAlign: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  color: "#28a745",
                  marginBottom: "4px",
                }}
              >
                {highScore}
              </div>
              <div style={{ color: "#6c757d", fontSize: "14px" }}>🏆 Best Score</div>
            </div>
            <div>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  color: "#007bff",
                  marginBottom: "4px",
                }}
              >
                {totalQuizzes}
              </div>
              <div style={{ color: "#6c757d", fontSize: "14px" }}>
                🎯 Quizzes Taken
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  color: "#ffc107",
                  marginBottom: "4px",
                }}
              >
                {highScore > 0 ? Math.round((highScore / 10) * 100) : 0}%
              </div>
              <div style={{ color: "#6c757d", fontSize: "14px" }}>
                📊 Best Accuracy
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div
        style={{
          maxWidth: "800px",
          margin: "40px auto",
          padding: "0 16px",
        }}
      >
        {/* Features Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "20px",
              textAlign: "center",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              border: "2px solid #e9ecef",
            }}
          >
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>⏱️</div>
            <h3 style={{ margin: "0 0 6px 0", color: "#333", fontSize: "16px" }}>
              Timed Challenge
            </h3>
            <p style={{ color: "#6c757d", margin: 0, fontSize: "13px" }}>
              30 seconds per question to keep you engaged
            </p>
          </div>

          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "20px",
              textAlign: "center",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              border: "2px solid #e9ecef",
            }}
          >
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>📚</div>
            <h3 style={{ margin: "0 0 6px 0", color: "#333", fontSize: "16px" }}>
              Diverse Topics
            </h3>
            <p style={{ color: "#6c757d", margin: 0, fontSize: "13px" }}>
              Questions from various categories and difficulties
            </p>
          </div>

          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "20px",
              textAlign: "center",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              border: "2px solid #e9ecef",
            }}
          >
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>🏆</div>
            <h3 style={{ margin: "0 0 6px 0", color: "#333", fontSize: "16px" }}>
              Score Tracking
            </h3>
            <p style={{ color: "#6c757d", margin: 0, fontSize: "13px" }}>
              Track your progress and beat your high scores
            </p>
          </div>
        </motion.div>

        {/* Quiz Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            textAlign: "center",
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "36px", marginBottom: "8px" }}>🎯</div>
            <h2
              style={{
                margin: "0 0 12px 0",
                fontSize: "22px",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              Customize Your Challenge
            </h2>
            <p
              style={{
                color: "#6c757d",
                fontSize: "14px",
                maxWidth: "400px",
                margin: "0 auto",
                lineHeight: "1.5",
              }}
            >
              Choose the number of questions and difficulty level that suits your
              mood. Ready to put your knowledge to the test?
            </p>
          </div>

          {/* Settings */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            <div style={{ textAlign: "left" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "600",
                  color: "#333",
                  fontSize: "14px",
                }}
              >
                📋 Number of Questions
              </label>
              <select
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "2px solid #e9ecef",
                  fontSize: "14px",
                  backgroundColor: "white",
                  cursor: "pointer",
                }}
              >
                <option value="5">5 Questions</option>
                <option value="10">10 Questions</option>
                <option value="15">15 Questions</option>
                <option value="20">20 Questions</option>
              </select>
            </div>

            <div style={{ textAlign: "left" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "600",
                  color: "#333",
                  fontSize: "14px",
                }}
              >
                {getDifficultyIcon(difficulty)} Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: `2px solid ${getDifficultyColor(difficulty)}`,
                  fontSize: "14px",
                  backgroundColor: "white",
                  cursor: "pointer",
                }}
              >
                <option value="any">Any Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Quiz Preview */}
          <div
            style={{
              background: "#f8f9fa",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "20px",
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: "#495057",
                fontSize: "13px",
                fontWeight: "500",
              }}
            >
              ⏱️ {numQuestions * 0.5} min estimated
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: "#495057",
                fontSize: "13px",
                fontWeight: "500",
              }}
            >
              📝 {numQuestions} questions
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: getDifficultyColor(difficulty),
                fontSize: "13px",
                fontWeight: "500",
              }}
            >
              {getDifficultyIcon(difficulty)}{" "}
              {difficulty === "any" ? "Mixed" : difficulty} difficulty
            </div>
          </div>

          {/* Start Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              padding: "12px 28px",
              borderRadius: "40px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
              transition: "all 0.3s ease",
              width: "100%",
              maxWidth: "280px",
            }}
          >
            Start Quiz 🚀
          </motion.button>
        </motion.div>
      </div>

      {/* Footer */}
      <div
        style={{
          background: "#343a40",
          color: "white",
          padding: "24px 16px",
          textAlign: "center",
          marginTop: "60px",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h3 style={{ margin: "0 0 12px 0", fontSize: "16px" }}>
            🧠 Quiz Challenge
          </h3>
          <p
            style={{
              color: "#adb5bd",
              margin: "0 0 12px 0",
              fontSize: "13px",
              lineHeight: "1.4",
            }}
          >
            Test your knowledge, track your progress, and challenge yourself with
            our interactive quiz platform.
          </p>
          <div
            style={{
              borderTop: "1px solid #495057",
              paddingTop: "12px",
              color: "#6c757d",
              fontSize: "11px",
            }}
          >
            © 2024 Quiz Challenge. Questions powered by Open Trivia Database.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
