import Application from './application'

const CARDS_PATH = '../img/cards/'
const MAX_TIME = 60
const IMG_LIST = [
  'among-us.svg',
  'bioshock-infinite.svg',
  'call-of-duty.svg',
  'cities-skylines.svg',
  'csgo.svg',
  'cuphead.svg',
  'cyberpunk-2077.svg',
  'dota2.svg',
  'fall-guys.svg',
  'gta-5.svg',
  'gta-vice-city.svg',
  'half-life.svg',
  'kerbal-space-program.svg',
  'metro-last-light-redux.svg',
  'minecraft.svg',
  'sonic-mania.svg',
  'the-elder-scrolls-v-skyrim.svg',
  'the-sims-4.svg',
  'the-witcher-3.svg'
]

export default class Memory extends Application {
  static appName = 'Memory Game'
  static id = 'memory-game'
  static icon = '../img/memory.svg'
  static width = 400
  static height = 500
  static scaleble = false

  timeLeft = MAX_TIME
  opened = 0
  attempts = 0
  won = false
  gameEnded = false

  /**
   * Gets the HTML Element of the application
   * @returns {HTMLElement} App element
   */
  getApplicationElement () {
    this.appBody = super.getApplicationElement()
    const options = this.appBody.children[0].querySelectorAll('.option')
    options.forEach(option => {
      option.addEventListener('click', (e) => this.startGameCallback(e, this))
    })
    return this.appBody
  }

  /**
   * Handles starting the game
   * @param {Event} e The event object
   * @param {Memory} memory The memory object
   */
  startGameCallback (e, memory) {
    const button = e.target.closest('.option')
    let difficulty = button.classList[1]
    const element = e.target.closest('.memory-game')

    // Hide start page
    element.querySelector('.start-menu').classList.add('hidden')
    const gamePage = element.querySelector('.game-page')
    gamePage.classList.remove('hidden')
    if (difficulty === 'easy') {
      difficulty = 4
      this.wmWindow.resizeWindow(300, 350)
    } else if (difficulty === 'normal') {
      difficulty = 8
      this.wmWindow.resizeWindow(550, 350)
    } else if (difficulty === 'advanced') {
      difficulty = 16
      this.wmWindow.resizeWindow(550, 600)
    }

    memory.difficulty = difficulty

    const cardsGrid = element.querySelector('.cards')
    cardsGrid.className = 'cards'
    cardsGrid.className += ' c' + memory.difficulty

    const paths = memory.createCardImages()
    const emptyCard = cardsGrid.querySelector('.card').cloneNode(true)
    emptyCard.querySelector('.back-img').className = 'back-img hidden'
    emptyCard.querySelector('.front-img').className = 'front-img'
    cardsGrid.innerHTML = ''
    memory.cardsList = []
    paths.forEach((path) => {
      const card = emptyCard.cloneNode(true)
      card.querySelector('.back-img').setAttribute('src', CARDS_PATH + path)
      card.addEventListener('click', (e) => memory.flip(e))
      cardsGrid.appendChild(card)
    })
    memory.timeElement = memory.wmWindow.windowElement.querySelector('.time-left')
    memory.decreaseTime()
  }

  /**
   * Shuffles an array
   * @param {Array} array The array to shuffle
   * @returns {Array} Shuffled array
   */
  shuffleArray (array) {
    const shuffledArray = [...array]
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]
    }
    return shuffledArray
  }

  /**
   * Create random cards based on the difficulty
   * @returns {Array} Array with random images
   */
  createCardImages () {
    const randomPaths = this.shuffleArray(IMG_LIST)
    let paths = randomPaths.slice(0, this.difficulty / 2)
    paths.push(...paths)
    paths = this.shuffleArray(paths)

    return paths
  }

  /**
   * Click handler for flipping a card
   * @param {Event} e The event object
   */
  flip (e) {
    const card = e.target.closest('.card')
    const front = card.querySelector('.front-img')
    if (front.classList.contains('hidden')) return
    const back = card.querySelector('.back-img')
    back.classList.remove('hidden')
    front.classList.add('hidden')

    setTimeout(() => {
      if (this.lastOpen == null) {
        this.lastOpen = card
        return
      }
      this.attempts += 1
      const lastBack = this.lastOpen.querySelector('.back-img')
      const lastFront = this.lastOpen.querySelector('.front-img')

      const lastImg = lastBack.getAttribute('src')
      const currentImg = back.getAttribute('src')
      if (lastImg !== currentImg) {
        lastBack.classList.add('hidden')
        lastFront.classList.remove('hidden')
        back.classList.add('hidden')
        front.classList.remove('hidden')
      } else {
        this.opened += 1
        this.won = this.opened === this.difficulty / 2
        if (this.won) this.gameOver()
      }
      this.lastOpen = null
    }, 500)
  }

  /**
   * Handles the ending of the game
   */
  gameOver () {
    const gamePage = this.wmWindow.windowElement.querySelector('.game-page')
    const modal = document.createElement('div')
    modal.className = 'modal'

    const title = document.createElement('h1')
    const description = document.createElement('p')
    const tryAgain = document.createElement('div')
    tryAgain.className = 'try-again'
    tryAgain.innerText = 'Try Again'
    tryAgain.addEventListener('click', (e) => this.tryAgainCallback(e))
    if (this.won) {
      title.innerText = 'You Won!'
      description.innerText = `You won in ${MAX_TIME - this.timeLeft} seconds with only ${this.attempts} attempts!`
    } else {
      title.innerText = 'Game Over!'
      description.innerText = 'The time is out! Good luck next time!'
    }
    modal.appendChild(title)
    modal.appendChild(description)
    modal.appendChild(tryAgain)
    gamePage.appendChild(modal)
  }

  /**
   * Callback for the try again button
   * @param {Event} e The Event object.
   */
  tryAgainCallback (e) {
    const modal = e.target.closest('.modal')
    const gamePage = e.target.closest('.game-page')
    const startMenu = this.wmWindow.windowElement.querySelector('.start-menu')
    startMenu.classList.remove('hidden')
    gamePage.removeChild(modal)
    gamePage.classList.add('hidden')
    this.timeLeft = MAX_TIME
    this.attempts = 0
    this.opened = 0
    this.won = false
    this.gameEnded = false
    const obj = Object.getPrototypeOf(this).constructor
    this.wmWindow.resizeWindow(obj.width, obj.height)
  }

  /**
   * Decreases the time left
   */
  decreaseTime () {
    if (this.gameEnded || this.won) return
    this.timeElement.innerText = this.timeLeft
    setTimeout(() => {
      if (this.timeLeft === 0 && !this.won) {
        this.gameOver()
      } else {
        this.timeLeft -= 1
        this.decreaseTime()
      }
    }, 1000)
  }
}
