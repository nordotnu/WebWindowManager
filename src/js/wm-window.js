export default class WMWindow {
  // Used only to keep track of the window wxh for fullscreen
  savedPosition = {
    width: '100px',
    height: '100px',
    top: '0px',
    left: '0px',
    fullscreen: false,
    minimized: false
  }

  constructor (title, width, height, scaleble, contents, exitCallback, task) {
    this.task = task
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
    minimizeButton.addEventListener('click', (e) => this.toggleMinimize(this, false))
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
        this.clickHandler(this)
      })
      resizer.addEventListener('dragend', (event) => {
        event.target.classList.remove('scalling')
      })
      windowElement.appendChild(resizer)
    }

    const exitButton = document.createElement('button')
    exitButton.classList.add('exit')
    exitButton.innerText = 'X'
    exitButton.addEventListener('click', (e) => exitCallback(this))
    controlsElement.appendChild(exitButton)
    bar.appendChild(controlsElement)

    // Listen to the events
    bar.addEventListener('dragstart', (e) => this.dragStartHandler(e, this))
    bar.addEventListener('dragend', () => this.dragEndHandler(this))
    windowElement.addEventListener('click', (e) => this.clickHandler(this))

    const observer = new MutationObserver(() => {
      return this.onChangeHandler(this)
    })
    observer.observe(windowElement, { attributes: true })

    this.windowElement = windowElement
  }

  /**
   * The event handler for the dragstart event.
   * @param {Event} event The event object.
   * @param {WMWindow} wmWindow The window object.
   */
  dragStartHandler (event, wmWindow) {
    if (wmWindow.savedPosition.fullscreen) {
      console.log(wmWindow.savedPosition.width)
      wmWindow.savedPosition.top = '0px'
      wmWindow.savedPosition.left = event.clientX - (parseInt(wmWindow.savedPosition.width) / 2) + 'px'
      console.log(wmWindow.savedPosition.left)
      wmWindow.fullscreenHandler(event, wmWindow)
    } else {
      wmWindow.focusWindow(wmWindow.windowElement)
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
   * @param {WMWindow} wmWindow The window object.
   */
  dragEndHandler (wmWindow) {
    wmWindow.windowElement.classList.remove('dragging')
    this.focusWindow(wmWindow.windowElement)
  }

  /**
   * Handles a click to the window bar
   * @param {WMWindow} wmWindow The window object.
   */
  clickHandler (wmWindow) {
    const element = wmWindow.windowElement
    wmWindow.focusWindow(element)
  }

  /**
   * Handles the fullscreen button
   * @param {Event} event The event object
   * @param {WMWindow} obj the window object
   */
  fullscreenHandler (event, obj) {
    const target = obj.windowElement
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
    this.focusWindow(target)
  }

  focusWindow (windowElement) {
    windowElement.classList.add('focused')
    while (windowElement.nextElementSibling != null) {
      windowElement.nextElementSibling.classList.remove('focused')
      windowElement.parentNode.insertBefore(windowElement.nextElementSibling, windowElement)
    }
  }

  /**
   * Toggle the minimization of the window
   * with the option to focus before minimizing.
   * @param {WMWindow} wmWindow The window object.
   * @param {boolean} focus Whether to focus the window before minimizing it.
   */
  toggleMinimize (wmWindow, focus) {
    if (wmWindow.savedPosition.minimized) {
      wmWindow.focusWindow(wmWindow.windowElement)
      wmWindow.windowElement.classList.remove('hidden')
      wmWindow.savedPosition.minimized = false
    } else if (focus && !wmWindow.windowElement.classList.contains('focused')) {
      wmWindow.focusWindow(wmWindow.windowElement)
    } else {
      wmWindow.windowElement.classList.add('hidden')
      wmWindow.savedPosition.minimized = true
    }
  }

  /**
   * Handles resize or moving of a window.
   * @param {WMWindow} wmWindow The window object
   */
  onChangeHandler (wmWindow) {
    const target = wmWindow.windowElement
    if (wmWindow.fullscreen) {
      wmWindow.positionMapper(target.style, wmWindow.savedPosition)
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
