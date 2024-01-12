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

  slideFromLeft = [{ transform: 'translateX(-100%)' },
    { transform: 'translateX(0%)' }]

  slideFromRight = [{ transform: 'translateX(100%)' },
    { transform: 'translateX(0%)' }]

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

    const emojiBtn = this.appBody.children[0].querySelector('.emoji-btn')
    emojiBtn.addEventListener('click', (e) => this.openEmoji(e))

    const emojis = this.appBody.children[0].querySelectorAll('.emojis p')
    emojis.forEach((p) => {
      p.addEventListener('click', (e) => this.insertEmoji(e))
    })

    const textarea = this.appBody.children[0].querySelector('textarea')
    textarea.addEventListener('keydown', (e) => this.sendMessage(e))

    // Load the saved messages on start
    const observer = new MutationObserver(() => {
      this.loadSavedMessages()
      observer.disconnect()
    })
    observer.observe(this.wmWindow.windowElement, { subtree: true, childList: true })

    // Make sure the messages always scrolled to the bottom
    const windowChangeObserver = new MutationObserver(() => {
      const messages = this.wmWindow.windowElement.querySelector('.messages')
      messages.scrollTo(0, messages.scrollHeight)
    })
    windowChangeObserver.observe(this.wmWindow.windowElement, { attributes: true })

    // Get and set the stored username
    const storedUsername = sessionStorage.getItem('username')
    if (storedUsername !== null) {
      userInput.value = storedUsername
      this.username = storedUsername
    }

    // Initilize the chat service
    this.chatService = new ChatService(this.username, this.channel, (msg) => this.receiveMessage(msg))
    this.chatService.connect()

    return this.appBody
  }

  /**
   * Handles the changing of the username.
   * @param {Event} e The event object.
   */
  editUsername (e) {
    if (e.target.className === 'username' && e.key !== 'Enter') return
    e.preventDefault()
    const chatApp = this.wmWindow.windowElement.querySelector('.chat-app')
    const userInput = chatApp.querySelector('.username')
    const userEdit = chatApp.querySelector('.username-edit')
    if (!userInput.disabled) {
      this.username = userInput.value
      this.chatService.username = userInput.value
      sessionStorage.setItem('username', this.username)
      userInput.disabled = true
      userEdit.classList.remove('active')
      userInput.selected = false
      this.loadSavedMessages()
    } else {
      userInput.disabled = false
      userInput.focus()
      userInput.select()
      userEdit.classList.add('active')
    }
  }

  /**
   * Handles the changing of the channel.
   * @param {Event} e The event object.
   */
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
      this.loadSavedMessages()
    } else {
      channelInput.disabled = false
      channelInput.focus()
      channelInput.select()
      channelEdit.classList.add('active')
    }
  }

  /**
   * Handles Sending a message.
   * @param {Event} e The event object.
   */
  sendMessage (e) {
    const chatApp = this.wmWindow.windowElement.querySelector('.chat-app')
    const message = chatApp.querySelector('textarea')
    if (e.key == null || (e.key === 'Enter' && !e.shiftKey)) {
      e.preventDefault()
      if (message.value.trim().length !== 0) {
        this.chatService.sendMessage(message.value)
        message.value = ''
      }
    }
  }

  /**
   * Handles reciving a message.
   * @param {*} message The message object.
   * @param {boolean} store Wether to store the message in the storage.
   */
  receiveMessage (message, store = true) {
    const chatApp = this.wmWindow.windowElement.querySelector('.chat-app')
    const messages = chatApp.querySelector('.messages')
    const messageElement = document.createElement('div')
    messageElement.className = 'message'
    let animation = this.slideFromLeft
    if (message.username === this.username) {
      messageElement.classList.add('self')
      animation = this.slideFromRight
    }

    const user = document.createElement('p')
    user.className = 'user'
    user.innerText = message.username

    const timeStamp = document.createElement('p')
    timeStamp.className = 'time-stamp'
    timeStamp.innerText = `${message.timeStamp}`

    const content = document.createElement('p')
    content.className = 'content'
    content.innerText = message.data

    messageElement.appendChild(user)
    messageElement.appendChild(timeStamp)
    messageElement.appendChild(content)

    messages.appendChild(messageElement)
    messages.scrollTo(0, messages.scrollHeight)

    if (store) {
      this.storeMessage(message)
      messageElement.animate(animation, { duration: 200, iterations: 1 })
    } else {
      messageElement.style.animation = 'none'
    }
  }

  /**
   * Stores a message in the session storage.
   * @param {*} message The message object.
   */
  storeMessage (message) {
    const storedMessagesJson = sessionStorage.getItem('messages')
    const jsonMessage = JSON.stringify([message])
    if (storedMessagesJson !== null) {
      const storedMessages = JSON.parse(storedMessagesJson)
      let exist = false
      for (let i = 0; i < storedMessages.length; i++) {
        exist = exist || JSON.stringify(storedMessages[i]) === JSON.stringify(message)
      }
      if (!exist) {
        storedMessages.push(message)
        sessionStorage.setItem('messages', JSON.stringify(storedMessages))
      }
    } else {
      sessionStorage.setItem('messages', jsonMessage)
    }
  }

  /**
   * Loads and displays the saved messages
   */
  loadSavedMessages () {
    const storedMessages = sessionStorage.getItem('messages')
    const chatApp = this.wmWindow.windowElement.querySelector('.chat-app')
    chatApp.querySelector('.messages').innerHTML = ''
    if (storedMessages !== null) {
      const messages = JSON.parse(storedMessages)
      // Clear messages
      messages.forEach(message => {
        if (message.channel === this.channel) {
          this.receiveMessage(message, false)
        }
      })
    }
  }

  /**
   * Handles the opening of the emoji menu
   * @param {Event} e The event object.
   */
  openEmoji (e) {
    const chatApp = this.wmWindow.windowElement.querySelector('.chat-app')
    const emojiMenu = chatApp.querySelector('.emojis')

    if (emojiMenu.classList.contains('hidden')) {
      emojiMenu.classList.remove('hidden')
    } else {
      emojiMenu.classList.add('hidden')
    }
  }

  /**
   * Handles the inserting of an emoji.
   * @param {Event} e The event object.
   */
  insertEmoji (e) {
    const emoji = e.target.innerText
    const chatApp = this.wmWindow.windowElement.querySelector('.chat-app')
    const textarea = chatApp.querySelector('textarea')
    textarea.value += emoji
    chatApp.querySelector('.emojis').classList.add('hidden')
    textarea.focus()
  }
}
