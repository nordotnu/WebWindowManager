import Application from './application'

export default class Paint extends Application {
  static appName = 'Paint'
  static id = 'paint-app'
  static icon = '../img/paint.svg'
  static width = 400
  static height = 300
  static scaleble = true

  lastCanvas = document.createElement('img')
  drawing = false
  erasing = false
  drawTool = true
  lineWidth = 1

  /**
   * Gets the HTML Element of the application
   * @returns {HTMLElement} App element
   */
  getApplicationElement () {
    this.appBody = super.getApplicationElement()

    // Observe loading of the app
    const observer = new MutationObserver(() => {
      this.startApp()
      observer.disconnect()
    })
    observer.observe(this.wmWindow.windowElement, { subtree: true, childList: true })

    // Observe resize of the window
    const resizeObserver = new MutationObserver(() => {
      this.offsetCanvas()
    })
    resizeObserver.observe(this.wmWindow.windowElement, { attributeFilter: ['style'] })

    return this.appBody
  }

  /**
   * Starts the application
   */
  startApp () {
    this.paintApp = this.wmWindow.windowElement.querySelector('.paint-app')
    this.canvas = this.paintApp.querySelector('.canvas')

    this.context = this.canvas.getContext('2d')
    this.canvas.width = this.canvas.offsetWidth
    this.canvas.height = this.canvas.offsetHeight

    this.canvas.addEventListener('mousemove', (e) => this.draw(e))
    this.canvas.addEventListener('mousedown', (e) => this.startDraw(e))
    this.canvas.addEventListener('mouseup', (e) => this.stopDraw(e))

    this.tools = this.paintApp.querySelectorAll('.tool')

    this.tools.forEach(tool => {
      tool.addEventListener('click', (e) => this.selectTool(e))
    })

    this.colors = this.paintApp.querySelectorAll('.color')
    this.colors.forEach(color => {
      color.addEventListener('click', (e) => this.selectColor(e))
    })
  }

  /**
   * Change the canvas size when the window resizes
   */
  offsetCanvas () {
    if (this.lastCanvas.src == null) return
    this.canvas.width = this.canvas.offsetWidth
    this.canvas.height = this.canvas.offsetHeight
    this.context = this.canvas.getContext('2d')
    this.context.drawImage(this.lastCanvas, 0, 0)
  }

  /**
   * Handles the start drawing event.
   * @param {Event} e The event object.
   */
  startDraw (e) {
    this.drawing = true
    this.context.beginPath()
    this.context.lineWidth = this.lineWidth
    if (this.drawTool) {
      this.context.strokeStyle = this.color
    } else {
      this.context.strokeStyle = 'white'
    }
  }

  /**
   * Handles the stop drawing event.
   * @param {Event} e The event object.
   */
  stopDraw (e) {
    this.drawing = false
    this.lastCanvas.src = this.canvas.toDataURL('image/png')
  }

  /**
   * Handles the drawing event.
   * @param {Event} e The event object.
   */
  draw (e) {
    if (this.drawing) {
      this.context.lineTo(e.offsetX, e.offsetY)
      this.context.stroke()
    }
  }

  /**
   * Handles the changing of the current color.
   * @param {Event} e The event object.
   */
  selectColor (e) {
    this.color = e.target.style.backgroundColor
    this.colors.forEach(color => {
      if (color.classList.contains('selected')) {
        color.classList.remove('selected')
      }
    })
    e.target.classList.add('selected')
  }

  /**
   * Handles the tool change.
   * @param {Event} e The event object.
   */
  selectTool (e) {
    const classes = e.target.closest('.tool').classList
    if (classes.contains('size')) {
      if (classes.contains('inc')) {
        this.lineWidth += 1
      } else if (this.lineWidth !== 0) {
        this.lineWidth -= 1
      }
      this.paintApp.querySelector('.width').innerText = this.lineWidth + 'px'
    } else {
      this.tools.forEach(tool => {
        if (tool.classList.contains('selected')) {
          tool.classList.remove('selected')
        }
      })

      if (classes.contains('pen')) {
        this.drawTool = true
      } else if (classes.contains('eraser')) {
        this.drawTool = false
      }

      classes.add('selected')
    }
  }
}
