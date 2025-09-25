import React, { useState } from 'react'
import './QuestionForm.css'

const QuestionForm = ({ onSubmit, onCancel }) => {
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', ''])
  const [timeLimit, setTimeLimit] = useState(60)
  const [correctIndex, setCorrectIndex] = useState(null)

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, ''])
    }
  }

  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index)
      setOptions(newOptions)
    }
  }

  const updateOption = (index, value) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const trimmedQuestion = question.trim()
    const trimmedOptions = options.map(opt => opt.trim()).filter(opt => opt !== '')
    
    if (!trimmedQuestion) {
      alert('Please enter a question')
      return
    }
    
    if (trimmedOptions.length < 2) {
      alert('Please enter at least 2 options')
      return
    }

    onSubmit({
      text: trimmedQuestion,
      options: trimmedOptions,
      timeLimit: 60,
      correctIndex: correctIndex
    })
  }

  const canSubmit = question.trim() && options.filter(opt => opt.trim()).length >= 2

  return (
    <div className="question-form-container">
      <div className="question-form-card card">
        <h2> Create New Poll</h2>
        
        <form onSubmit={handleSubmit} className="question-form">
          <div className="input-group">
            <label htmlFor="question">Enter your question</label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., Which planet is known as the Red Planet?"
              rows="3"
              required
            />
          </div>

          <div className="input-group">
            <label>Poll Options</label>
            <div className="options-list">
              {options.map((option, index) => (
                <div key={index} className="option-input-group">
                  <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                  <label style={{ marginLeft: '12px', fontSize: '0.9rem' }}>
                    <input
                      type="radio"
                      name="correctOption"
                      checked={correctIndex === index}
                      onChange={() => setCorrectIndex(index)}
                    />{' '}
                    Correct
                  </label>
                  {options.length > 2 && (
                    <button
                      type="button"
                      className="remove-option-btn"
                      onClick={() => removeOption(index)}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            {options.length < 6 && (
              <button type="button" className="btn btn-secondary add-option-btn" onClick={addOption}>
                + Add Option
              </button>
            )}
          </div>

          <div className="input-group">
            <label>Time Limit</label>
            <div style={{
              display:'flex', alignItems:'center', justifyContent:'space-between',
              background:'#f7f7fb', border:'1px solid #e5e7f0', borderRadius:8, padding:'12px 14px'
            }}>
              <span>Each question allows up to</span>
              <strong>60 seconds</strong>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={!canSubmit}>
              Ask Question
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default QuestionForm