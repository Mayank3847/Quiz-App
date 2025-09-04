import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Results() {
  const [results, setResults] = useState(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("quizResults");
    if (stored) {
      const parsed = JSON.parse(stored);
      setResults(parsed);

      // Calculate score
      let s = 0;
      parsed.questions.forEach((q, idx) => {
        if (parsed.selectedAnswers[idx] === q.correct) {
          s++;
        }
      });
      setScore(s);

      // Load previous high score
      const prevHigh = parseInt(localStorage.getItem("highScore") || "0", 10);

      // Update high score if current is greater
      if (s > prevHigh) {
        localStorage.setItem("highScore", s);
        setHighScore(s);
        setIsNewHighScore(true);
      } else {
        setHighScore(prevHigh);
      }
    } else {
      // If no results, go back home
      navigate("/");
    }
  }, [navigate]);

  const handleTakeAgain = () => {
    localStorage.removeItem("quizResults");
    navigate("/");
  };

  const handleShareResults = async () => {
    const shareData = {
      title: 'Quiz Challenge Results',
      text: `I scored ${score}/${results.questions.length} (${Math.round((score/results.questions.length) * 100)}%) on the Quiz Challenge!`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback - copy to clipboard
        await navigator.clipboard.writeText(shareData.text);
        alert('Results copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  if (!results) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '18px'
      }}>
        Loading results...
      </div>
    );
  }

  const percentage = Math.round((score / results.questions.length) * 100);
  const correctAnswers = score;
  const incorrectAnswers = results.questions.length - score;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <h1 style={{
            margin: '0 0 20px 0',
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#333'
          }}>
            🧠 Quiz Challenge
          </h1>
        </div>

        {/* Results Header Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            background: 'linear-gradient(135deg, #4f94ef 0%, #3b82f6 100%)',
            borderRadius: '16px',
            padding: '40px',
            textAlign: 'center',
            color: 'white',
            marginBottom: '30px',
            boxShadow: '0 8px 32px rgba(79, 148, 239, 0.3)'
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div style={{
              fontSize: '48px',
              marginBottom: '16px'
            }}>
              🏆
            </div>
            <h2 style={{
              margin: '0 0 16px 0',
              fontSize: '32px',
              fontWeight: 'bold'
            }}>
              Quiz Complete!
            </h2>
            <div style={{
              fontSize: '28px',
              fontWeight: 'bold',
              marginBottom: '8px'
            }}>
              {score} <span style={{ fontSize: '20px', opacity: 0.9 }}>out of</span> {results.questions.length}
            </div>
            <div style={{
              fontSize: '18px',
              opacity: 0.9
            }}>
              {percentage}% Correct
            </div>
            {isNewHighScore && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                style={{
                  marginTop: '16px',
                  padding: '8px 16px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                🎉 New High Score!
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* Answer Review */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            marginBottom: '30px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }}
        >
          <h3 style={{
            margin: '0 0 25px 0',
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#333'
          }}>
            Answer Review
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {results.questions.map((q, idx) => {
              const userAns = results.selectedAnswers[idx];
              const correct = q.correct;
              const isCorrect = userAns === correct;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + (idx * 0.1) }}
                  style={{
                    border: `2px solid ${isCorrect ? '#d4edda' : '#f8d7da'}`,
                    borderRadius: '12px',
                    padding: '20px',
                    backgroundColor: isCorrect ? '#d4edda' : '#f8d7da',
                    position: 'relative'
                  }}
                >
                  {/* Correct/Incorrect Icon */}
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: isCorrect ? '#28a745' : '#dc3545',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    {isCorrect ? '✓' : '✗'}
                  </div>

                  {/* Question */}
                  <div style={{ marginLeft: '40px' }}>
                    <h4 style={{
                      margin: '0 0 12px 0',
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#333',
                      lineHeight: '1.4'
                    }} dangerouslySetInnerHTML={{ __html: q.question }} />

                    {/* Category and Difficulty */}
                    <div style={{
                      display: 'flex',
                      gap: '12px',
                      marginBottom: '16px'
                    }}>
                      <span style={{
                        background: '#e9ecef',
                        color: '#495057',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {q.category?.replace('Entertainment: ', '').replace('Science: ', '') || 'General'}
                      </span>
                      <span style={{
                        background: q.difficulty === 'easy' ? '#d4edda' : 
                                   q.difficulty === 'medium' ? '#fff3cd' : '#f8d7da',
                        color: q.difficulty === 'easy' ? '#155724' : 
                               q.difficulty === 'medium' ? '#856404' : '#721c24',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {q.difficulty || 'medium'}
                      </span>
                    </div>

                    {/* Answers */}
                    <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
                      <div style={{
                        color: '#dc3545',
                        marginBottom: '4px'
                      }}>
                        <strong>Your answer:</strong> <span dangerouslySetInnerHTML={{ __html: userAns || "No answer" }} />
                      </div>
                      {!isCorrect && (
                        <div style={{ color: '#28a745' }}>
                          <strong>Correct answer:</strong> <span dangerouslySetInnerHTML={{ __html: correct }} />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Performance Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            marginBottom: '30px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }}
        >
          <h3 style={{
            margin: '0 0 25px 0',
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#333'
          }}>
            Performance Summary
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '20px',
            textAlign: 'center'
          }}>
            <div>
              <div style={{
                fontSize: '36px',
                fontWeight: 'bold',
                color: '#28a745',
                marginBottom: '8px'
              }}>
                {correctAnswers}
              </div>
              <div style={{
                fontSize: '16px',
                color: '#6c757d'
              }}>
                Correct
              </div>
            </div>

            <div>
              <div style={{
                fontSize: '36px',
                fontWeight: 'bold',
                color: '#dc3545',
                marginBottom: '8px'
              }}>
                {incorrectAnswers}
              </div>
              <div style={{
                fontSize: '16px',
                color: '#6c757d'
              }}>
                Incorrect
              </div>
            </div>

            <div>
              <div style={{
                fontSize: '36px',
                fontWeight: 'bold',
                color: '#007bff',
                marginBottom: '8px'
              }}>
                {percentage}%
              </div>
              <div style={{
                fontSize: '16px',
                color: '#6c757d'
              }}>
                Accuracy
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            marginBottom: '40px'
          }}
        >
          <button
            onClick={handleTakeAgain}
            style={{
              padding: '16px 32px',
              borderRadius: '12px',
              border: 'none',
              background: '#007bff',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 16px rgba(0, 123, 255, 0.3)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#0056b3';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#007bff';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            🔄 Take Quiz Again
          </button>

          <button
            onClick={handleShareResults}
            style={{
              padding: '16px 32px',
              borderRadius: '12px',
              border: '2px solid #6c757d',
              background: 'white',
              color: '#495057',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#f8f9fa';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            📤 Share Results
          </button>
        </motion.div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          color: '#6c757d',
          fontSize: '14px'
        }}>
          © 2024 Quiz Challenge. Questions powered by Open Trivia Database.
        </div>
      </div>
    </div>
  );
}

export default Results;