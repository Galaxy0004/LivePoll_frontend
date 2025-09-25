import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setSocket, setParticipants, setResults, setError, clearError, kickOut, setTimeRemaining } from './store/pollSlice'
import socketService from './services/socketService'
import RoleSelection from './components/RoleSelection'
import TeacherDashboard from './components/TeacherDashboard'
import StudentDashboard from './components/StudentDashboard'
import ErrorModal from './components/ErrorModal'
import './App.css'

function App() {
  const dispatch = useDispatch()
  const { role, isKickedOut, error } = useSelector(state => state.poll)
  
  const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'

  useEffect(() => {
    const socket = socketService.connect(SERVER_URL)
    dispatch(setSocket(socket))

    // Socket event listeners
    socket.on('state_update', (data) => {
      if (data.participants) {
        dispatch(setParticipants(data.participants))
      }
      // Students should not see intermediate results from state sync
      if (data.results && role === 'teacher') {
        dispatch(setResults(data.results))
      }
      if (data.timeRemaining !== undefined) {
        dispatch(setTimeRemaining(data.timeRemaining))
      }
    })

    socket.on('participants_update', (participants) => {
      dispatch(setParticipants(participants))
    })

    socket.on('results_update', (results) => {
      // Only teachers receive incremental results
      if (role === 'teacher') {
        dispatch(setResults(results))
      }
    })

    socket.on('error', (errorData) => {
      dispatch(setError(errorData.message))
    })

    socket.on('kicked_out', () => {
      dispatch(kickOut())
    })

    return () => {
      socketService.disconnect()
    }
  }, [dispatch, SERVER_URL, role])
  
  if (isKickedOut) {
    return (
      <div className="kicked-out-container">
        <div className="card">
          <h2>You've been Kicked out!</h2>
          <p>Looks like the teacher had removed you from the poll system. Please try again sometime.</p>
        </div>
        </div>
    )
  }

  return (
    <div className="App">
      {error && <ErrorModal message={error} onClose={() => dispatch(clearError())} />}
      {!role ? <RoleSelection /> : (role === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />)}
    </div>
  )
}

export default App