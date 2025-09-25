import React from 'react'
import PollResults from './PollResults'

const PollHistory = ({ history, onClose }) => {
  if (!history || history.length === 0) {
    return (
      <div className="card" style={{ padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>View Poll History</h2>
          {onClose && (
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          )}
        </div>
        <p style={{ opacity: 0.7, marginTop: 8 }}>No polls yet. Create a poll to see it here after it completes.</p>
      </div>
    )
  }

  return (
    <div className="poll-history">
      <div className="card" style={{ padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>View Poll History</h2>
          {onClose && (
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          )}
        </div>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {history.map((h, idx) => (
            <div key={h.id || idx}>
              <h3 style={{ margin: '6px 0 8px 0' }}>Question {history.length - idx}</h3>
              <PollResults results={{
                question: h.question,
                results: h.results,
                totalVotes: h.totalVotes,
                correctIndex: h.correctIndex,
                timeRemaining: 0
              }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PollHistory
