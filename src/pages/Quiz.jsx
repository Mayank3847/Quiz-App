import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [showSkipModal, setShowSkipModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let didFetch = false;

    const fetchQuestions = async () => {
      if (didFetch) return;
      didFetch = true;

      setLoading(true);
      setError("");

      try {
        const settings =
          JSON.parse(localStorage.getItem("quizSettings")) || {
            numQuestions: 10,
            difficulty: "easy",
          };

        let apiUrl = `https://opentdb.com/api.php?amount=${settings.numQuestions}&type=multiple`;
        if (settings.difficulty && settings.difficulty !== "any") {
          apiUrl += `&difficulty=${settings.difficulty}`;
        }

        const res = await fetch(apiUrl);

        if (!res.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await res.json();

        if (data.results && data.results.length > 0) {
          const formatted = data.results.map((q) => {
            const options = [...q.incorrect_answers];
            const randomIndex = Math.floor(Math.random() * 4);
            options.splice(randomIndex, 0, q.correct_answer);

            return {
              question: q.question,
              correct: q.correct_answer,
              options,
              category: q.category,
              difficulty: q.difficulty,
            };
          });

          setQuestions(formatted);
        } else {
          throw new Error("API returned no questions");
        }
      } catch (err) {
        console.error("Quiz fetch failed:", err);

        setQuestions([
          {
            question: "What is the capital of France?",
            correct: "Paris",
            options: ["Paris", "London", "Berlin", "Madrid"],
            category: "Geography",
            difficulty: "easy",
          },
          {
            question: "Which language runs in a web browser?",
            correct: "JavaScript",
            options: ["Python", "C++", "JavaScript", "Java"],
            category: "Science: Computers",
            difficulty: "easy",
          },
          {
            question: "Who wrote 'Hamlet'?",
            correct: "William Shakespeare",
            options: [
              "William Wordsworth",
              "William Shakespeare",
              "John Milton",
              "Charles Dickens",
            ],
            category: "Entertainment: Literature",
            difficulty: "medium",
          },
        ]);

        setError("⚠️ Using fallback questions (API unavailable).");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Reset timer when question changes
  useEffect(() => {
    setTimeLeft(30);
  }, [currentIndex]);

  // Countdown effect
  useEffect(() => {
    if (timeLeft === 0) {
      handleNext();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  // Calculate score whenever selected answers change
  useEffect(() => {
    const currentScore = selectedAnswers.reduce((acc, answer, index) => {
      if (questions[index] && answer === questions[index].correct) {
        return acc + 1;
      }
      return acc;
    }, 0);
    setScore(currentScore);
  }, [selectedAnswers, questions]);

  const handleAnswerSelect = (answer) => {
    const updated = [...selectedAnswers];
    updated[currentIndex] = answer;
    setSelectedAnswers(updated);
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      finishQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSkip = () => {
    setShowSkipModal(true);
  };

  const confirmSkip = () => {
    finishQuiz();
  };

  const cancelSkip = () => {
    setShowSkipModal(false);
  };

  const finishQuiz = () => {
    localStorage.setItem(
      "quizResults",
      JSON.stringify({
        questions,
        selectedAnswers,
        finalScore: score,
        totalQuestions: questions.length,
        completedQuestions: currentIndex + 1,
      })
    );
    navigate("/results");
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        fontSize: '18px' 
      }}>
        Loading questions...
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const selected = selectedAnswers[currentIndex];
  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        marginBottom: '30px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h1 style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#333'
          }}>
            🧠 Quiz Challenge
          </h1>
          <div style={{
            fontSize: '14px',
            color: '#666'
          }}>
            {currentQ?.category && (
              <>
                {currentQ.category.replace('Entertainment: ', '').replace('Science: ', '')}
              </>
            )}
          </div>
        </div>

        {/* Progress and Score */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px'
            }}>
              <span style={{ fontSize: '14px', color: '#666' }}>
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                Score: {score}/{questions.length}
              </span>
            </div>
            <div style={{
              background: '#e9ecef',
              height: '8px',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${progressPercentage}%`,
                background: '#007bff',
                height: '100%',
                transition: 'width 0.3s ease',
                borderRadius: '4px'
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Quiz Card */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '40px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            marginBottom: '20px'
          }}
        >
          {/* Timer and Category */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px'
          }}>
            <div style={{
              background: currentQ?.difficulty === 'easy' ? '#d4edda' : 
                         currentQ?.difficulty === 'medium' ? '#fff3cd' : '#f8d7da',
              color: currentQ?.difficulty === 'easy' ? '#155724' : 
                     currentQ?.difficulty === 'medium' ? '#856404' : '#721c24',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 'bold',
              textTransform: 'lowercase'
            }}>
              {currentQ?.difficulty || 'medium'}
            </div>
            <div style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: timeLeft <= 5 ? '#dc3545' : '#28a745',
              background: timeLeft <= 5 ? '#f8d7da' : '#d4edda',
              padding: '8px 16px',
              borderRadius: '20px'
            }}>
              Time Left: {timeLeft}s
            </div>
          </div>

          {error && (
            <div style={{
              color: '#856404',
              background: '#fff3cd',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #ffeaa7'
            }}>
              {error}
            </div>
          )}

          {/* Question */}
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{
              fontSize: '22px',
              fontWeight: '600',
              color: '#333',
              lineHeight: '1.4',
              margin: 0
            }} dangerouslySetInnerHTML={{ __html: currentQ.question }} />
          </div>

          {/* Options */}
          <div style={{ 
            marginBottom: '40px',
            width: '100%',
            overflow: 'visible'
          }}>
            {currentQ.options.map((opt, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswerSelect(opt)}
                style={{
                  width: '100%',
                  margin: '8px 0',
                  padding: '16px 20px',
                  borderRadius: '10px',
                  border: selected === opt ? '2px solid #007bff' : '2px solid #e9ecef',
                  background: selected === opt ? '#007bff' : 'white',
                  color: selected === opt ? 'white' : '#333',
                  cursor: 'pointer',
                  fontSize: '16px',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: selected === opt ? '2px solid white' : '2px solid #dee2e6',
                  background: selected === opt ? 'white' : 'transparent',
                  marginRight: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  color: selected === opt ? '#007bff' : '#666'
                }}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span dangerouslySetInnerHTML={{ __html: opt }} />
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Navigation Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: '2px solid #6c757d',
              background: currentIndex === 0 ? '#e9ecef' : 'white',
              color: currentIndex === 0 ? '#6c757d' : '#495057',
              cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
          >
            ← Previous
          </button>

          <button
            onClick={handleSkip}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: '2px solid #dc3545',
              background: 'white',
              color: '#dc3545',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
          >
            Skip Challenge
          </button>

          <button
            onClick={handleNext}
            disabled={!selected}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              background: !selected ? '#e9ecef' : '#007bff',
              color: !selected ? '#6c757d' : 'white',
              cursor: !selected ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
          >
            {currentIndex + 1 === questions.length ? 'Finish Quiz' : 'Next →'}
          </button>
        </div>
      </div>

      {/* Skip Confirmation Modal */}
      {showSkipModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '30px',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
            }}
          >
            <h3 style={{ marginBottom: '20px', color: '#333' }}>
              Skip Quiz Challenge?
            </h3>
            <p style={{ marginBottom: '25px', color: '#666', lineHeight: '1.5' }}>
              Are you sure you want to quit? Your current score of <strong>{score}/{questions.length}</strong> will be your final score.
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button
                onClick={cancelSkip}
                style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: '2px solid #6c757d',
                  background: 'white',
                  color: '#495057',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              >
                Continue Quiz
              </button>
              <button
                onClick={confirmSkip}
                style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#dc3545',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              >
                Yes, Quit
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Quiz;