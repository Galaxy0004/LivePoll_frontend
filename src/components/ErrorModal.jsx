import React, { useEffect } from 'react'
import './ErrorModal.css'

const ErrorModal = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="error-modal-overlay">
      <div className="error-modal card">
        <div className="error-header">
          <span className="error-icon">⚠️</span>
          <h3>Error</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="error-message">{message}</div>
      </div>
    </div>
  )
}

export default ErrorModal