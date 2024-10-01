import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [participantName, setParticipantName] = useState('');
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/questions.json');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
    const storedScores = JSON.parse(localStorage.getItem('quizScores')) || [];
    setScores(storedScores);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    let tempScore = 0;

    questions.forEach((q, index) => {
      const selectedAnswer = event.target[`q${index}`].value;
      if (selectedAnswer === q.answer) {
        tempScore++;
      }
    });

    const newScoreEntry = { name: participantName, score: tempScore };
    const updatedScores = [...scores, newScoreEntry];
    setScores(updatedScores);
    localStorage.setItem('quizScores', JSON.stringify(updatedScores));

    setScore(tempScore);
    setSubmitted(true);
  };

  return (
    <div className="container">
      <h1>Python Quiz</h1>
      <div className="instructions">
        <p><strong>Instructions:</strong></p>
        <ul>
          <li>Please attempt all questions.</li>
          <li>No negative marking for incorrect answers.</li>
        </ul>
      </div>
      {!submitted ? (
        <>
          <input 
            type="text" 
            placeholder="Enter your name" 
            value={participantName} 
            onChange={(e) => setParticipantName(e.target.value)} 
            required 
          />
          <form onSubmit={handleSubmit}>
            {questions.length > 0 ? questions.map((q, index) => (
              <div className="question" key={index}>
                <label>{index + 1}. {q.question}</label><br />
                {q.options.map((option, i) => (
                  <div key={i}>
                    <input type="radio" name={`q${index}`} value={option} required />
                    {option}
                  </div>
                ))}
              </div>
            )) : (
              <p>Loading questions...</p>
            )}
            <button type="submit">Submit</button>
          </form>
        </>
      ) : (
        <div className="result">
          <h2>{participantName}, your score: {score} out of {questions.length}</h2>
          <button onClick={() => setSubmitted(false)}>Try Again</button>
          <h3>Participant Scores:</h3>
          <ul>
            {scores.map((entry, index) => (
              <li key={index}>{entry.name}: {entry.score}</li>
            ))}
          </ul>
        </div>
      )}
      <footer className="footer">
        <p>Made with ❤️ by PM</p>
        <a href="https://github.com/26-pm" target="_blank" rel="noopener noreferrer" className="github-link">
          <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" alt="GitHub" className="github-logo" />
        </a>
      </footer>
    </div>
  );
};

export default App;
