export default class Desktop {
  constructor () {
    this.desktop = document.querySelector('.desktop')

    this.desktop.addEventListener('dragenter', (event) => {
      event.preventDefault()
    })
    this.desktop.addEventListener('dragover', (event) => {
      event.preventDefault()
    })
    this.desktop.addEventListener('drop', this.dropHandler)
  }

  /**
   * Opens a window in the desktop.
   * @param {HTMLElement} windowContent The contents of the window
   */
  addWindow (windowContent) {
    // Create the window
    const windowElement = document.createElement('div')
    windowElement.draggable = true
    windowElement.classList.add('window')
    const cont = document.createElement('h1')
    cont.innerText = windowContent
    windowElement.appendChild(cont)

    // Listen to the events
    windowElement.addEventListener('dragstart', this.dragStartHandler)
    windowElement.addEventListener('dragend', this.dragEndHandler)
    this.desktop.appendChild(windowElement)
  }

  /**
   * The event handler for the dragstart event.
   * @param {Event} event The event object.
   */
  dragStartHandler (event) {
    const style = window.getComputedStyle(event.target, null)
    event.target.classList.add('dragging')
    // Remember the original position
    event.dataTransfer.setData('text/plain',
      (parseInt(style.getPropertyValue('left'), 10) - event.clientX) + ',' + (parseInt(style.getPropertyValue('top'), 10) - event.clientY)
    )

    event.dataTransfer.dropEffect = 'move'
  }

  /**
   *
   * @param {Event} event The event object.
   */
  dragEndHandler (event) {
    event.target.classList.remove('dragging')
  }

  /**
   *
   * @param {Event} event The event object.
   */
  dropHandler (event) {
    const target = document.querySelector('.dragging')
    const offset = event.dataTransfer.getData('text/plain').split(',')

    target.style.left = (event.clientX + parseInt(offset[0], 10)) + 'px'
    target.style.top = (event.clientY + parseInt(offset[1], 10)) + 'px'

    event.preventDefault()
  }
}
