import TaskBar from './taskbar'
import WMWindow from './wm-window'
export default class Desktop {
  runningApps = []
  nextPosition = {
    top: 10,
    left: 10
  }

  constructor () {
    this.desktop = document.querySelector('.desktop')
    this.taskbar = new TaskBar()
    this.desktop.addEventListener('dragenter', (event) => {
      event.preventDefault()
    })
    this.desktop.addEventListener('dragover', this.scalerHandler)
    this.desktop.addEventListener('drop', this.dropHandler)

    // This is an cooler effect but a bit heavy for development
    // this.desktop.addEventListener('dragover', this.dropHandler)
  }

  /**
   * Opens a application in the desktop.
   * @param {object} Application The class of the application
   */
  openApp (Application) {
    this.incrementNextPosition()
    let app
    const wmWindow = new WMWindow(Application.appName,
      Application.width, Application.height,
      this.nextPosition.top, this.nextPosition.left,
      Application.scaleble,
      (wmWindow, app) => this.exitHandler(wmWindow, app, this))

    // Create an instance of application
    // eslint-disable-next-line prefer-const
    app = new Application(wmWindow)
    const content = app.getApplicationElement()
    wmWindow.appendContent(content)

    wmWindow.task = this.taskbar.addTask(Application.appName, Application.icon, (e) => {
      wmWindow.toggleMinimize(wmWindow, true)
    })
    this.runningApps.push(app)
    this.desktop.appendChild(wmWindow.windowElement)
  }

  registerApp (Application) {
    // Create an icon
    const template = document.querySelector('#icon')
    const icon = template.content.cloneNode(true)
    icon.querySelector('img').setAttribute('src', Application.icon)
    icon.querySelector('p').innerText = Application.appName
    icon.children[0].addEventListener('click', () => {
      this.openApp(Application)
    })
    const iconsGrid = this.desktop.querySelector('.icons-grid')
    iconsGrid.appendChild(icon)
  }

  /**
   * Increments the next position of the window.
   */
  incrementNextPosition () {
    if (this.nextPosition.top < 200) {
      this.nextPosition.top += 30
      this.nextPosition.left += 30
    }
    if (this.nextPosition.top > 200) {
      this.nextPosition.top = 30
      this.nextPosition.left += 100
      if (this.nextPosition.left > window.innerWidth) {
        this.nextPosition.top = 30
        this.nextPosition.left = 30
      }
    }
  }

  /**
   * Handles the exiting of a window.
   * @param {WMWindow} wmWindow The window object.
   * @param {Application} app the app object.
   * @param {Desktop} desktop the desktop object.
   */
  exitHandler (wmWindow, app, desktop) {
    desktop.runningApps.pop(app)
    desktop.taskbar.removeTask(wmWindow.task)
    wmWindow.windowElement.remove()
  }

  /**
   * Handles dropping of a draged window
   * @param {Event} event The event object.
   */
  dropHandler (event) {
    const target = document.querySelector('.dragging')
    // Prevent placing the window behind the taskbar
    if (target != null && !event.target.classList.contains('taskbar')) {
      const offset = event.dataTransfer.getData('text/plain').split(',')

      target.style.left = (event.clientX + parseInt(offset[0])) + 'px'
      target.style.top = (event.clientY + parseInt(offset[1])) + 'px'
    }

    event.preventDefault()
  }

  /**
   * Handles the scalling of the window
   * @param {Event} event The event object.
   */
  scalerHandler (event) {
    const scalling = document.querySelector('.scalling')
    if (scalling != null) {
      const windowElement = scalling.parentNode
      const style = window.getComputedStyle(windowElement, null)
      const newWidth = event.clientX - parseInt(style.getPropertyValue('left'))
      const newHeight = event.clientY - parseInt(style.getPropertyValue('top'))
      if (newWidth > 300) {
        windowElement.style.width = newWidth + 'px'
      }
      if (newHeight > 300) {
        windowElement.style.height = newHeight + 'px'
      }
    }
    event.preventDefault()
  }
}
