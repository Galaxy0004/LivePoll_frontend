import React, { useState, useEffect } from 'react'
import './QuestionView.css'
import './QuestionTimer.css'

const QuestionView = ({ question, timeRemaining, onVote }) => {
  const [selectedOption, setSelectedOption] = useState(null)
  const [hasVoted, setHasVoted] = useState(false)

  useEffect(() => {
    setSelectedOption(null)
    setHasVoted(false)
  }, [question])

  const handleVote = () => {
    if (selectedOption !== null && !hasVoted) {
      onVote(selectedOption)
      setHasVoted(true)
    }
  }

  const getTimeColor = () => {
    const secs = Number.isFinite(timeRemaining) ? timeRemaining : 0
    if (secs > 30) return 'green'
    if (secs > 10) return 'orange'
    return 'red'
  }

  const formatTime = (secs) => {
    const safe = Number.isFinite(secs) && secs >= 0 ? secs : 0
    const m = Math.floor(safe / 60).toString().padStart(2, '0')
    const s = Math.floor(safe % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  return (
    <div className="question-view-container">
      <div className="question-view-card card">
        <div className="question-header">
          <h2>{`Question${question?.number ? ` ${question.number}` : ''}`}</h2>
          <div className={`timer digital ${getTimeColor()}`} aria-live="polite" aria-label={`Time remaining ${formatTime(timeRemaining)}`}>
            <span className="icon" aria-hidden="true">⏱️</span>
            <span className="digits">{formatTime(timeRemaining)}</span>
          </div>
        </div>

        <div className="question-content">
          <div className="question-bar">
            <span className="question-text">{question.text}</span>
          </div>

          <div className="options-list">
            {question.options.map((option, index) => (
              <button
                type="button"
                key={index}
                className={`option-row ${selectedOption === index ? 'selected' : ''}`}
                onClick={() => !hasVoted && setSelectedOption(index)}
                disabled={hasVoted}
              >
                <span className={`radio ${selectedOption === index ? 'on' : ''}`}></span>
                <span className="option-label">{option}</span>
              </button>
            ))}
          </div>

          <div className="vote-actions">
            <button
              className="btn btn-primary vote-btn"
              onClick={handleVote}
              disabled={selectedOption === null || hasVoted}
            >
              {hasVoted ? 'Submitted' : 'Submit'}
            </button>

            {selectedOption !== null && !hasVoted && (
              <div className="selected-preview">
                You selected: <strong>{question.options[selectedOption]}</strong>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuestionView