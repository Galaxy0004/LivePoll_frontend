import React from 'react'
import './PollResults.css'
const PollResults = ({ results }) => {
  if (!results) return null

  const maxVotes = Math.max(...results.results.map(r => r.votes))

  return (
    <div className="poll-results-container">
      <div className="poll-results-card card">
        <h2> Poll Results</h2>
        <div className="results-content">
          <div className="results-question-bar">
            <span className="question-text">{results.question}</span>
          </div>
          <div className="results-list">
            {results.results.map((result, index) => (
              <div
                key={index}
                className="result-item compact-row"
                style={results.correctIndex === index ? { borderColor: '#7ecb92' } : {}}
              >
                <div className="compact-header">
                  <span className="number-badge">{index + 1}</span>
                  <span className="option-text">{result.option}</span>
                  <span className="percentage-right-inline">{result.percentage}%</span>
                </div>
                <div className="result-bar-container compact">
                  <div className="result-bar">
                    <div className="result-fill" style={{ width: `${result.percentage}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="results-summary">
            <div className="total-votes">Total votes: {results.totalVotes}</div>
            {results.timeRemaining !== undefined && results.timeRemaining > 0 && (
              <div className="time-remaining">Time remaining: {results.timeRemaining}s</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PollResults