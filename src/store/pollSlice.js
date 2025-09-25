import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  role: null,
  userName: '',
  currentQuestion: null,
  isQuestionActive: false,
  participants: [],
  results: null,
  myVote: null,
  timeRemaining: 0,
  socket: null,
  error: null,
  isKickedOut: false,
  timeLimit: 60
}

const pollSlice = createSlice({
  name: 'poll',
  initialState,
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload
    },
    setUserName: (state, action) => {
      state.userName = action.payload
    },
    setSocket: (state, action) => {
      state.socket = action.payload
    },
    setCurrentQuestion: (state, action) => {
      state.currentQuestion = action.payload
      state.isQuestionActive = true
      state.myVote = null
      state.timeRemaining = action.payload?.timeLimit || 60
    },
    setQuestionActive: (state, action) => {
      state.isQuestionActive = action.payload
    },
    setParticipants: (state, action) => {
      state.participants = action.payload
    },
    setResults: (state, action) => {
      state.results = action.payload
    },
    setMyVote: (state, action) => {
      state.myVote = action.payload
    },
    setTimeRemaining: (state, action) => {
      state.timeRemaining = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    kickOut: (state) => {
      state.isKickedOut = true
    },
    resetPoll: (state) => {
      state.currentQuestion = null
      state.isQuestionActive = false
      state.results = null
      state.myVote = null
      state.timeRemaining = 0
    },
    setTimeLimit: (state, action) => {
      state.timeLimit = action.payload
    }
  },
})

export const {
  setRole,
  setUserName,
  setSocket,
  setCurrentQuestion,
  setQuestionActive,
  setParticipants,
  setResults,
  setMyVote,
  setTimeRemaining,
  setError,
  clearError,
  kickOut,
  resetPoll,
  setTimeLimit
} = pollSlice.actions

export default pollSlice.reducer