import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setUserName, setCurrentQuestion, setQuestionActive, setResults, setMyVote, setTimeRemaining } from '../store/pollSlice'
import socketService from '../services/socketService'
import NameEntry from './NameEntry'
import QuestionView from './QuestionView'
import PollResults from './PollResults'
import './StudentDashboard.css'
import ChatWidget from './ChatWidget'

const StudentDashboard = () => {
  const dispatch = useDispatch()
  const { userName, currentQuestion, isQuestionActive, results, myVote, timeRemaining } = useSelector(state => state.poll)
  const socket = socketService.getSocket()
  
  const [localName, setLocalName] = useState('')

  // On first mount, if a name exists in this tab's sessionStorage, auto-set and join
  useEffect(() => {
    if (!userName) {
      const saved = sessionStorage.getItem('lp_student_name')
      if (saved && socket) {
        dispatch(setUserName(saved))
        socket.emit('join_student', { name: saved })
      }
    }
  }, [dispatch, socket, userName])

  useEffect(() => {
    const handleNewQuestion = (data) => {
      dispatch(setCurrentQuestion({ ...data.question, timeLimit: data.timeLimit }))
      dispatch(setMyVote(null))
      dispatch(setTimeRemaining(data.timeLimit))
    }

    const handleQuestionExpired = (data) => {
      dispatch(setQuestionActive(false))
      dispatch(setResults(data.results))
    }

    const handleAllVoted = (data) => {
      dispatch(setQuestionActive(false))
      dispatch(setResults(data.results))
    }

    const handleReadyForNewQuestion = () => {
      dispatch(setQuestionActive(false))
      dispatch(setResults(null))
      dispatch(setCurrentQuestion(null))
    }

    socket.on('new_question', handleNewQuestion)
    socket.on('question_expired', handleQuestionExpired)
    socket.on('all_voted', handleAllVoted)
    socket.on('ready_for_new_question', handleReadyForNewQuestion)

    // Timer countdown
    let timerInterval
    if (isQuestionActive && timeRemaining > 0) {
      timerInterval = setInterval(() => {
        // Dispatch a numeric value, not a function. Using the latest
        // timeRemaining captured by this effect (which re-runs when
        // timeRemaining changes) avoids stale values and prevents NaN.
        dispatch(setTimeRemaining(Math.max(0, timeRemaining - 1)))
      }, 1000)
    }

    return () => {
      socket.off('new_question', handleNewQuestion)
      socket.off('question_expired', handleQuestionExpired)
      socket.off('all_voted', handleAllVoted)
      socket.off('ready_for_new_question', handleReadyForNewQuestion)
      if (timerInterval) clearInterval(timerInterval)
    }
  }, [dispatch, socket, isQuestionActive, timeRemaining])

  const handleNameSubmit = (name) => {
    dispatch(setUserName(name))
    // Do not persist name; always ask on fresh load
    try {
      sessionStorage.setItem('lp_student_name', name)
    } catch (_) {}
    socket.emit('join_student', { name })
  }

  const handleVoteSubmit = (optionIndex) => {
    socket.emit('submit_vote', { optionIndex })
    dispatch(setMyVote(optionIndex))
  }

  if (!userName) {
    return <NameEntry onSubmit={handleNameSubmit} />
  }

  return (
    <div className="student-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1> Student Dashboard</h1>
          <div className="student-info">
            <span className="welcome-text">Welcome, <strong>{userName}</strong>!</span>
            <div className={`status ${isQuestionActive ? 'active' : 'waiting'}`}>
              {isQuestionActive ? '📊 Question Active' : '⏳ Waiting for Question'}
            </div>
          </div>
        </div>
      </header>

      <div className="student-content">
        {!isQuestionActive && !results && (
          <div className="waiting-section">
            <div className="waiting-centered card">
              <div className="spinner" aria-hidden="true"></div>
              <h3 className="waiting-title">Wait for the teacher to ask questions..</h3>
            </div>
          </div>
        )}
        
        {isQuestionActive && currentQuestion && !myVote && (
          <QuestionView 
            question={currentQuestion}
            timeRemaining={timeRemaining}
            onVote={handleVoteSubmit}
          />
        )}

        {myVote !== null && !results && (
          <div className="waiting-section">
            <div className="waiting-centered card">
              <div className="spinner" aria-hidden="true"></div>
              <h3 className="waiting-title">Waiting for others to finish...</h3>
              <p style={{opacity:0.7, margin:0}}>Results will appear once all students have answered or time expires.</p>
            </div>
          </div>
        )}

        {results && (
          <div className="results-section">
            <PollResults results={results} />
          </div>
        )}
      </div>
      <ChatWidget />
    </div>
  )
}

export default StudentDashboard