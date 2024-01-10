const API_KEY = 'API_KEY'
const API_ENDPOINT = 'WSS_SOCKET'

export default class ChatService {
  constructor (username, channel, recevieCallback) {
    this.username = username
    this.channel = channel
    this.recevieCallback = recevieCallback
  }

  connect () {
    this.socket = new WebSocket(API_ENDPOINT)
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'message' && data.channel === this.channel) {
        data.timeStamp = new Date().toLocaleString()
        this.recevieCallback(data)
      }
    }
  }

  sendMessage (message) {
    const request = this.createJson(message)
    this.socket.send(request)
  }

  createJson (message) {
    const obj = {
      type: 'message',
      data: message,
      username: this.username,
      channel: this.channel,
      key: API_KEY
    }
    return JSON.stringify(obj)
  }
}
