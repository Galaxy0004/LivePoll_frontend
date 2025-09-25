import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import socketService from '../services/socketService'
import './ChatWidget.css'

const ChatWidget = () => {
  const dispatch = useDispatch()
  const { participants, role, userName } = useSelector(state => state.poll)
  const socket = socketService.getSocket()

  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('chat') // 'chat' | 'participants'
  const [messages, setMessages] = useState([
    // Seed with a helper message
    { id: 'sys-1', sender: 'Live Poll', text: 'Hey there. How can I help?', system: true },
  ])
  const [input, setInput] = useState('')
  const listRef = useRef(null)

  useEffect(() => {
    if (!socket) return

    const handleIncoming = (msg) => {
      setMessages(prev => [...prev, { id: `${Date.now()}`, ...msg }])
    }

    socket.on('chat_message', handleIncoming)
    return () => {
      socket.off('chat_message', handleIncoming)
    }
  }, [socket])

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages, open, activeTab])

  const sendMessage = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    const message = { sender: userName || (role === 'teacher' ? 'Teacher' : 'Student'), text: trimmed }
    try {
      socket?.emit?.('chat_message', message)
    } catch (_) {}
    setInput('')
  }

  const handleKick = (studentId) => {
    if (role !== 'teacher') return
    if (window.confirm('Kick this student out?')) {
      socket?.emit?.('remove_student', { studentId })
    }
  }

  return (
    <div className={`chat-widget ${open ? 'open' : ''}`}>
      {open && (
        <div className="chat-panel card">
          <div className="chat-tabs">
            <button className={`tab ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>Chat</button>
            <button className={`tab ${activeTab === 'participants' ? 'active' : ''}`} onClick={() => setActiveTab('participants')}>Participants</button>
          </div>

          {activeTab === 'chat' && (
            <div className="chat-area">
              <div className="messages" ref={listRef}>
                {messages.map(m => (
                  <div key={m.id} className={`msg ${m.system ? 'system' : (m.sender === userName ? 'me' : 'other')}`}>
                    {!m.system && <span className="from">{m.sender}</span>}
                    <div className="bubble">{m.text}</div>
                  </div>
                ))}
              </div>
              <div className="composer">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Type a message"
                  onKeyDown={e => { if (e.key === 'Enter') sendMessage() }}
                />
                <button className="send-btn" onClick={sendMessage}>Send</button>
              </div>
            </div>
          )}

          {activeTab === 'participants' && (
            <div className="participants-area">
              <div className="participants-head">
                <span>Name</span>
              </div>
              <div className="participants-list">
                {participants.map(p => (
                  <div key={p.id} className="row">
                    <span className="nm">{p.name}</span>
                    {role === 'teacher' && p.role === 'student' && (
                      <button className="kick" onClick={() => handleKick(p.id)}>Kick out</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <button className="chat-toggle" aria-label="Open chat" onClick={() => setOpen(o => !o)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 4h16v12H7l-3 3V4z" stroke="currentColor" strokeWidth="2" fill="none"/>
        </svg>
      </button>
    </div>
  )
}

export default ChatWidget
