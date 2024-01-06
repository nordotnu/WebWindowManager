import TaskBar from './taskbar'
import WMWindow from './wm-window'
export default class Desktop {
  windows = []
  constructor () {
    this.desktop = document.querySelector('.desktop')
    this.taskbar = new TaskBar()
    this.desktop.addEventListener('dragenter', (event) => {
      event.preventDefault()
    })
    this.desktop.addEventListener('dragover', this.scalerHandler)
    this.desktop.addEventListener('drop', this.dropHandler)

    // TESTING
    this.desktop.querySelector('.maximize')
      .addEventListener('click', (e) => this.maximizeAll(this))
  }

  /**
   * Opens a window in the desktop.
   * @param {HTMLElement} windowContent The contents of the window
   */
  addWindow (windowContent) {
    const contents = document.createElement('h2')
    contents.innerText = 'HEHE'
    const wmWindow = new WMWindow(windowContent, 500, 300, false, contents,
      (wmWindow) => this.exitHandler(wmWindow, this))
    wmWindow.task = this.taskbar.addTask(windowContent, (e) => wmWindow.toggleMinimize(wmWindow))
    this.windows.push(wmWindow)
    this.desktop.appendChild(wmWindow.windowElement)
  }

  maximizeAll (desktop) {
    desktop.windows.forEach((wmWindow) => {
      wmWindow.toggleMinimize(wmWindow)
    })
  }

  exitHandler (wmWindow, desktop) {
    desktop.windows.pop(wmWindow)
    desktop.taskbar.removeTask(wmWindow.task)
    wmWindow.windowElement.remove()
  }

  /**
   * Handles dropping of a draged window
   * @param {Event} event The event object.
   */
  dropHandler (event) {
    const target = document.querySelector('.dragging')
    if (target != null) {
      const offset = event.dataTransfer.getData('text/plain').split(',')

      target.style.left = (event.clientX + parseInt(offset[0])) + 'px'
      target.style.top = (event.clientY + parseInt(offset[1])) + 'px'

      // Move the dragged window to the bottom of the dom tree
      while (target.nextElementSibling != null) {
        target.parentNode.insertBefore(target.nextElementSibling, target)
      }
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
      if (newWidth > 100) {
        windowElement.style.width = newWidth + 'px'
      }
      if (newHeight > 100) {
        windowElement.style.height = newHeight + 'px'
      }
    }
    event.preventDefault()
  }
}
