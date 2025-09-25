import React, { useState } from 'react'
import './NameEntry.css'

const NameEntry = ({ onSubmit }) => {
  const [name, setName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim()) {
      onSubmit(name.trim())
    }
  }

  return (
    <div className="name-entry-container">
      <div className="name-entry-card card">
        <div className="header">
          <h1>Let's Get Started!</h1>
          <p>If you're a student, you'll be able to deliver your answers, participate in the polls, and see how your responses compare with your classmates.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="name-form">
          <div className="input-group">
            <label htmlFor="name">Enter your Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., John Doe"
              required
              autoFocus
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary continue-btn"
            disabled={!name.trim()}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  )
}

export default NameEntry