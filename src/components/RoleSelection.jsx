import React from 'react'
import { useDispatch } from 'react-redux'
import { setRole } from '../store/pollSlice'
import socketService from '../services/socketService'
import './RoleSelection.css'

const RoleSelection = () => {
  const dispatch = useDispatch()
  const socket = socketService.getSocket()

  const handleRoleSelect = (role) => {
    if (role === 'teacher') {
      socket.emit('join_teacher')
    }
    dispatch(setRole(role))
  }

  return (
    <div className="role-selection-container">
      <div className="role-selection-card card">
        <div className="header">
          <h1>Welcome to the Live Polling System</h1>
          <p>Please select the role that best describes your use of this live polling system.</p>
        </div>
        
        <div className="role-options">
          <div className="role-option student-option" onClick={() => handleRoleSelect('student')}>
            <div className="icon"></div>
            <h2>I'm a Student</h2>
            <p>You'll be able to deliver your answers, participate in the polls, and see how your responses compare with your classmates.</p>
            <div className="select-btn">Select as Student</div>
          </div>
          
          <div className="role-option teacher-option" onClick={() => handleRoleSelect('teacher')}>
            <div className="icon"></div>
            <h2>I'm a Teacher</h2>
            <p>You'll have the ability to create and manage polls, ask questions, and monitor your students' responses in real time.</p>
            <div className="select-btn">Select as Teacher</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoleSelection