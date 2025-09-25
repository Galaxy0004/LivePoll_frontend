import React from 'react'
import { useSelector } from 'react-redux'
import socketService from '../services/socketService'
import './ParticipantsList.css'

const ParticipantsList = () => {
  const { participants, role } = useSelector(state => state.poll)
  const socket = socketService.getSocket()

  const students = participants.filter(p => p.role === 'student')
  const teachers = participants.filter(p => p.role === 'teacher')

  const handleRemoveStudent = (studentId) => {
    if (window.confirm('Are you sure you want to remove this student?')) {
      socket.emit('remove_student', { studentId })
    }
  }

  return (
    <div className="participants-list-container">
      <div className="participants-card card">
        <h3>👥 Participants ({participants.length})</h3>
        
        <div className="participants-section">
          <h4>Teachers ({teachers.length})</h4>
          {teachers.map(teacher => (
            <div key={teacher.id} className="participant-item teacher">
              <span className="participant-name"> {teacher.name}</span>
              <span className="participant-status online">Online</span>
            </div>
          ))}
        </div>

        <div className="participants-section">
          <h4>Students ({students.length})</h4>
          {students.map(student => (
            <div key={student.id} className="participant-item student">
              <span className="participant-name">🎓 {student.name}</span>
              <div className="participant-actions">
                <span className="participant-status online">Online</span>
                {role === 'teacher' && (
                  <button 
                    className="remove-btn"
                    onClick={() => handleRemoveStudent(student.id)}
                    title="Remove student"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {students.length === 0 && (
          <div className="empty-state">
            <p>No students joined yet</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ParticipantsList