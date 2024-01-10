import Application from './application'
import ChatService from './chat-service'

export default class Chat extends Application {
  static appName = 'Chat App'
  static id = 'chat-app'
  static icon = '../img/chat.svg'
  static width = 400
  static height = 500
  static scaleble = true

  username = 'Anon'
  channel = 'public'

  /**
   * Gets the HTML Element of the application
   * @returns {HTMLElement} App element
   */
  getApplicationElement () {
    this.appBody = super.getApplicationElement()

    // Add Event listeners
    const userSetting = this.appBody.children[0].querySelector('.username-edit')
    const userInput = this.appBody.children[0].querySelector('.username')
    userSetting.addEventListener('click', (e) => this.editUsername(e))
    userInput.addEventListener('keydown', (e) => this.editUsername(e))

    const channelSetting = this.appBody.children[0].querySelector('.channel-edit')
    const channelInput = this.appBody.children[0].querySelector('.channel')
    channelSetting.addEventListener('click', (e) => this.editChannel(e))
    channelInput.addEventListener('keydown', (e) => this.editChannel(e))

    const sendBtn = this.appBody.children[0].querySelector('.send-btn')
    sendBtn.addEventListener('click', (e) => this.sendMessage(e))
    const textarea = this.appBody.children[0].querySelector('textarea')
    textarea.addEventListener('keydown', (e) => this.sendMessage(e))

    this.chatService = new ChatService(this.username, this.channel, (msg) => this.receiveMessage(msg))
    this.chatService.connect()
    return this.appBody
  }

  editUsername (e) {
    if (e.target.className === 'username' && e.key !== 'Enter') return
    e.preventDefault()
    const chatApp = this.wmWindow.windowElement.querySelector('.chat-app')
    const userInput = chatApp.querySelector('.username')
    const userEdit = chatApp.querySelector('.username-edit')
    if (!userInput.disabled) {
      this.username = userInput.value
      this.chatService.username = userInput.value
      userInput.disabled = true
      userEdit.classList.remove('active')
      userInput.selected = false
    } else {
      userInput.disabled = false
      userInput.focus()
      userInput.select()
      userEdit.classList.add('active')
    }
  }

  editChannel (e) {
    if (e.target.className === 'channel' && e.key !== 'Enter') return
    e.preventDefault()
    const chatApp = this.wmWindow.windowElement.querySelector('.chat-app')
    const channelInput = chatApp.querySelector('.channel')
    const channelEdit = chatApp.querySelector('.channel-edit')
    if (!channelInput.disabled) {
      this.channel = channelInput.value
      this.chatService.channel = channelInput.value
      channelInput.disabled = true
      channelEdit.classList.remove('active')
      channelInput.selected = false
    } else {
      channelInput.disabled = false
      channelInput.focus()
      channelInput.select()
      channelEdit.classList.add('active')
    }
  }

  sendMessage (e) {
    if (e.key == null || (e.key === 'Enter' && e.ctrlKey)) {
      const chatApp = this.wmWindow.windowElement.querySelector('.chat-app')
      const message = chatApp.querySelector('textarea')
      this.chatService.sendMessage(message.value)
      message.value = ''
    }
  }

  receiveMessage (message) {

    const chatApp = this.wmWindow.windowElement.querySelector('.chat-app')
    const messages = chatApp.querySelector('.messages')
    const messageElement = document.createElement('div')
    messageElement.className = 'message'

    if (message.username === this.username) {
      messageElement.classList.add('self')
    }


    const user = document.createElement('p')
    user.className = 'user'
    user.innerText = message.username

    const timeStamp = document.createElement('p')
    timeStamp.className = 'time-stamp'
    const time = new Date()
    timeStamp.innerText = `${time.toLocaleString()}`

    const content = document.createElement('p')
    content.className = 'content'
    content.innerText = message.data

    messageElement.appendChild(user)
    messageElement.appendChild(timeStamp)
    messageElement.appendChild(content)
    messages.appendChild(messageElement)
    
  }
}
