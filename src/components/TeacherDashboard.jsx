import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setCurrentQuestion, setQuestionActive, setResults, setError } from '../store/pollSlice'
import socketService from '../services/socketService'
import QuestionForm from './QuestionForm'
import PollResults from './PollResults'
import PollHistory from './PollHistory'
import './TeacherDashboard.css'
import ChatWidget from './ChatWidget'

const TeacherDashboard = () => {
  const dispatch = useDispatch()
  const { currentQuestion, isQuestionActive, participants, results } = useSelector(state => state.poll)
  const socket = socketService.getSocket()
  
  const [showQuestionForm, setShowQuestionForm] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState([])

  // Ensure this socket session is registered as teacher on the server
  useEffect(() => {
    if (socket) {
      socket.emit('join_teacher')
    }
  }, [socket])

  useEffect(() => {
    const handleNewQuestion = (data) => {
      dispatch(setCurrentQuestion({ ...data.question, timeLimit: data.timeLimit }))
      // When starting a new question, hide history if it was open
      setShowHistory(false)
    }

    const handleAllVoted = (data) => {
      dispatch(setQuestionActive(false))
      dispatch(setResults(data.results))
    }

    const handleQuestionExpired = (data) => {
      dispatch(setQuestionActive(false))
      dispatch(setResults(data.results))
    }

    const handleReadyForNewQuestion = () => {
      dispatch(setQuestionActive(false))
      dispatch(setResults(null))
      setShowQuestionForm(true)
      // Hide history when preparing new question
      setShowHistory(false)
    }

    const handleStateUpdate = (state) => {
      if (state?.history) setHistory(state.history)
    }
    const handleHistoryUpdate = (hist) => setHistory(hist || [])

    socket.on('new_question', handleNewQuestion)
    socket.on('all_voted', handleAllVoted)
    socket.on('question_expired', handleQuestionExpired)
    socket.on('ready_for_new_question', handleReadyForNewQuestion)
    socket.on('state_update', handleStateUpdate)
    socket.on('history_update', handleHistoryUpdate)

    return () => {
      socket.off('new_question', handleNewQuestion)
      socket.off('all_voted', handleAllVoted)
      socket.off('question_expired', handleQuestionExpired)
      socket.off('ready_for_new_question', handleReadyForNewQuestion)
      socket.off('state_update', handleStateUpdate)
      socket.off('history_update', handleHistoryUpdate)
    }
  }, [dispatch, socket])

  const handleCreateQuestion = (questionData) => {
    socket.emit('create_question', questionData)
    setShowQuestionForm(false)
  }

  const handleRequestNewQuestion = () => {
    socket.emit('request_new_question')
  }
  useEffect(() => {
    if (socket) socket.emit('get_history')
  }, [socket])

  const studentCount = participants.filter(p => p.role === 'student').length

  return (
    <div className="teacher-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1> Teacher Dashboard</h1>
          <div className="stats">
            <div className="stat">
              <span className="stat-label">Students Online:</span>
              <span className="stat-value">{studentCount}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Status:</span>
              <span className={`stat-value ${isQuestionActive ? 'active' : 'inactive'}`}>
                {isQuestionActive ? 'Poll Active' : 'Ready'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className={`dashboard-content ${(!isQuestionActive && !results && !showQuestionForm && !showHistory) ? 'single-col' : ''}`}>
        <div className="main-panel">
          {!isQuestionActive && !results && !showQuestionForm && !showHistory && (
            <div className="welcome-section">
              <div className="welcome-card card">
                <h2>Let's Get Started!</h2>
                <p>You'll have the ability to create and manage polls, ask questions, and monitor your students' responses in real time.</p>
                <button 
                  className="btn btn-primary ask-question-btn"
                  onClick={() => setShowQuestionForm(true)}
                >
                   Create New Poll
                </button>
                <button 
                  className="btn btn-secondary"
                  style={{ marginLeft: 12 }}
                  onClick={() => setShowHistory(true)}
                >
                   View Poll History
                </button>
              </div>
            </div>
          )}
          {showQuestionForm && (
            <QuestionForm 
              onSubmit={handleCreateQuestion}
              onCancel={() => setShowQuestionForm(false)}
            />
          )}
          {showHistory && (
            <div className="history-section">
              <PollHistory history={history} onClose={() => setShowHistory(false)} />
            </div>
          )}
          {isQuestionActive && currentQuestion && !showHistory && (
            <div className="active-question-section">
              <div className="card">
                <h2>Current Question</h2>
                <div className="question-card">
                  <h3>{currentQuestion.text}</h3>
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="result-item compact-row">
                      <div className="compact-header">
                        <span className="number-badge">{index + 1}</span>
                        <span className="option-text">{option}</span>
                        <span className="percentage-right-inline"></span>
                      </div>
                      <div className="result-bar-container compact">
                        <div className="result-bar">
                          <div className="result-fill" style={{ width: '0%' }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
               </div>
             </div>
           )}
           {results && !showHistory && (
            <div className="results-section">
              <PollResults results={results} />
              <div className="action-buttons">
                <button 
                  className="btn btn-primary new-question-btn"
                  onClick={handleRequestNewQuestion}
                >
                  ➕ Ask New Question
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowHistory(true)}
                >
                   View Poll History
                </button>
              </div>
            </div>
          )}
        </div>
        {/* Participants panel removed; use ChatWidget -> Participants tab instead */}
      </div>
      <ChatWidget />
    </div>
  )
}

export default TeacherDashboard