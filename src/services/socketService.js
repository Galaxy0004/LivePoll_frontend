import { io } from 'socket.io-client'

class SocketService {
  constructor() {
    this.socket = null
  }

  connect(serverUrl) {
    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling']
    })
    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  getSocket() {
    return this.socket
  }
}

export default new SocketService()