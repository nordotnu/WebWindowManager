export default class WMWindow {
  // Used only to keep track of the window wxh for fullscreen

  savedPosition = {
    width: '100px',
    height: '100px',
    top: '0px',
    left: '0px',
    fullscreen: false
  }

  constructor (title, width, height, scaleble, contents) {
    this.windowElement = this.createWindow(title, width, height, scaleble, contents)
  }

  createWindow (title, width, height, scaleble, contents) {
    this.savedPosition.width = width + 'px'
    this.savedPosition.height = height + 'px'
    // Create the bar
    const bar = document.createElement('div')
    bar.classList.add('bar')
    bar.classList.add('noselect')
    bar.draggable = true
    const titleElement = document.createElement('h3')
    titleElement.innerText = title
    bar.appendChild(titleElement)

    // Create the window
    const windowElement = document.createElement('div')
    windowElement.classList.add('window')
    this.positionMapper(this.savedPosition, windowElement.style)
    windowElement.appendChild(bar)
    windowElement.appendChild(contents)

    // Create controls
    const controlsElement = document.createElement('div')
    controlsElement.classList.add('controls')

    const minimizeButton = document.createElement('button')
    minimizeButton.classList.add('minimize')
    minimizeButton.innerText = '_'
    controlsElement.appendChild(minimizeButton)

    // Add scaler element
    if (scaleble) {
      const fullScreenButton = document.createElement('button')
      fullScreenButton.classList.add('fullscreen')
      fullScreenButton.innerText = '='
      fullScreenButton.addEventListener('click', (e) => this.fullscreenHandler(e, this))
      controlsElement.appendChild(fullScreenButton)
      const resizer = document.createElement('button')
      resizer.innerText = '>'
      resizer.draggable = true
      resizer.classList.add('scaler')
      resizer.addEventListener('dragstart', (event) => {
        if (!this.savedPosition.fullscreen) { event.target.classList.add('scalling') }
        this.clickHandler(event)
      })
      resizer.addEventListener('dragend', (event) => {
        event.target.classList.remove('scalling')
      })
      windowElement.appendChild(resizer)
    }

    const exitButton = document.createElement('button')
    exitButton.classList.add('exit')
    exitButton.innerText = 'X'
    controlsElement.appendChild(exitButton)
    bar.appendChild(controlsElement)

    // Listen to the events
    bar.addEventListener('dragstart', (e) => this.dragStartHandler(e, this))
    bar.addEventListener('dragend', this.dragEndHandler)
    windowElement.addEventListener('click', this.clickHandler)

    const observer = new MutationObserver((mutation, observer) => this.onChangeHandler(mutation, observer, this))
    observer.observe(windowElement, { attributes: true })

    return windowElement
  }

  /**
   * The event handler for the dragstart event.
   * @param {Event} event The event object.
   * @param {WMWindow} obj The window object.
   */
  dragStartHandler (event, obj) {
    if (obj.savedPosition.fullscreen) {
      console.log(obj.savedPosition.width)
      obj.savedPosition.top = '0px'
      obj.savedPosition.left = event.clientX - (parseInt(obj.savedPosition.width) / 2) + 'px'
      console.log(obj.savedPosition.left)
      obj.fullscreenHandler(event, obj)
    }
    const style = window.getComputedStyle(event.target.parentNode, null)
    event.target.parentNode.classList.add('dragging')
    // Remember the original position
    event.dataTransfer.setData('text/plain',
      (parseInt(style.getPropertyValue('left')) - event.clientX) +
       ',' + (parseInt(style.getPropertyValue('top')) - event.clientY)
    )
    event.dataTransfer.setDragImage(event.target.parentNode, event.layerX, event.layerY)
  }

  /**
   * Handles the end of a drag event
   * @param {Event} event The event object.
   */
  dragEndHandler (event) {
    event.target.parentNode.classList.remove('dragging')
  }

  /**
   * Handles a click to the window bar
   * @param {Event} event The event object.
   */
  clickHandler (event) {
    const target = event.target.closest('.window')

    // Move the dragged window to the bottom of the dom tree
    while (target.nextElementSibling != null) {
      target.parentNode.insertBefore(target.nextElementSibling, target)
    }
  }

  /**
   * Handles the fullscreen button
   * @param {Event} event The event object
   * @param {WMWindow} obj the window object
   */
  fullscreenHandler (event, obj) {
    const target = event.target.closest('.window')
    console.log(target)
    const resizer = target.getElementsByClassName('scaler')[0]
    if (!obj.savedPosition.fullscreen) {
      obj.savedPosition.fullscreen = true
      obj.positionMapper(target.style, obj.savedPosition)
      target.style.width = window.innerWidth + 'px'
      target.style.height = window.innerHeight + 'px'
      target.style.top = 0
      target.style.left = 0
      resizer.classList.add('hidden')
    } else {
      obj.savedPosition.fullscreen = false
      obj.positionMapper(obj.savedPosition, target.style)
      resizer.classList.remove('hidden')
    }
    while (target.nextElementSibling != null) {
      target.parentNode.insertBefore(target.nextElementSibling, target)
    }
  }

  /**
   * Handles resize or moving of a window.
   * @param {Array<HTMLElement>} mutationsList List of mutated elements
   * @param {MutationObserver} observer The observer object
   * @param {WMWindow} obj The window object
   */
  onChangeHandler (mutationsList, observer, obj) {
    for (const mutation of mutationsList) {
      const target = mutation.target
      if (target.classList.contains('window') && obj.fullscreen) {
        obj.positionMapper(target.style, obj.savedPosition)
      }
    }
  }

  /**
   * Maps style properties
   * @param {*} src The source style
   * @param {*} dist The distination style
   */
  positionMapper (src, dist) {
    dist.height = src.height
    dist.width = src.width
    dist.top = src.top
    dist.left = src.left
  }
}
