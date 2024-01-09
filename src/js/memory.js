import Application from './application'

const cardsPath = '../img/cards/'
const imgsList = [
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
  static scaleble = true

  opened = 0
  atempts = 0
  won = false

  getApplicationElement () {
    this.appBody = super.getApplicationElement()
    const options = this.appBody.children[0].querySelectorAll('.option')
    options.forEach(option => {
      option.addEventListener('click', (e) => this.startGameCallback(e, this))
    })
    return this.appBody
  }

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

    const paths = memory.createCardImages(memory)
    const emptyCard = cardsGrid.querySelector('.card').cloneNode(true)
    cardsGrid.innerHTML = ''
    memory.cardsList = []
    paths.forEach((path) => {
      const card = emptyCard.cloneNode(true)
      card.querySelector('.back-img').setAttribute('src', cardsPath + path)
      card.addEventListener('click', (e) => memory.flip(e, memory))
      cardsGrid.appendChild(card)
    })
  }

  shuffleArray (array) {
    const shuffledArray = [...array]
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]
    }
    return shuffledArray
  }

  createCardImages (memory) {
    const randomPaths = memory.shuffleArray(imgsList)
    let paths = randomPaths.slice(0, memory.difficulty / 2)
    paths.push(...paths)
    paths = memory.shuffleArray(paths)

    return paths
  }

  flip (e, memory) {
    const card = e.target.closest('.card')
    const front = card.querySelector('.front-img')
    if (front.classList.contains('hidden')) return
    const back = card.querySelector('.back-img')
    back.classList.remove('hidden')
    front.classList.add('hidden')

    setTimeout(() => {
      if (memory.lastOpen == null) {
        memory.lastOpen = card
        return
      }
      memory.atempts += 1
      const lastBack = memory.lastOpen.querySelector('.back-img')
      const lastFront = memory.lastOpen.querySelector('.front-img')

      const lastImg = lastBack.getAttribute('src')
      const currentImg = back.getAttribute('src')
      if (lastImg !== currentImg) {
        lastBack.classList.add('hidden')
        lastFront.classList.remove('hidden')
        back.classList.add('hidden')
        front.classList.remove('hidden')
      } else {
        memory.opened += 1
        memory.won = memory.opened === memory.difficulty / 2
      }
      memory.lastOpen = null
    }, 500)
  }
}
