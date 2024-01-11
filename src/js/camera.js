import Application from './application'

export default class Camera extends Application {
  static appName = 'Camera'
  static id = 'camera-app'
  static icon = '../img/camera.svg'
  static width = 345
  static height = 303
  static scaleble = true

  constast = 100
  brightness = 100

  /**
   * Gets the HTML Element of the application
   * @returns {HTMLElement} App element
   */
  getApplicationElement () {
    this.appBody = super.getApplicationElement()

    // Load the saved messages on start
    const observer = new MutationObserver(() => {
      this.startCamera()
      observer.disconnect()
    })
    observer.observe(this.wmWindow.windowElement, { subtree: true, childList: true })

    return this.appBody
  }

  /**
   * Starts the camera
   */
  startCamera () {
    const cameraApp = this.wmWindow.windowElement.querySelector('.camera-app')
    const cameraView = cameraApp.querySelector('.camera-view')
    cameraView.addEventListener('wheel', (e) => this.changeStyle(e))
    cameraView.addEventListener('click', (e) => {
      e.target.style.filter = ''
      this.brightness = 100
      this.constast = 100
    })

    const constraints = { video: { facingMode: 'user' }, audio: false }

    /**
     * Handles the video stream
     */
    function cameraStart () {
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function (stream) {
          stream.track = stream.getTracks()[0]
          cameraView.srcObject = stream
        })
        .catch(function (error) {
          console.error('ERROR: ', error)
        })
    }
    cameraStart()
  }

  /**
   * Handles the changing of the video style
   * @param {Event} e The event object.
   */
  changeStyle (e) {
    if (e.wheelDeltaX > 0) {
      this.constast += 5
    } else if (e.wheelDeltaX < 0 && this.constast > 0) {
      this.constast -= 5
    }
    if (e.wheelDeltaY > 0) {
      this.brightness += 5
    } else if (e.wheelDeltaY < 0 && this.brightness > 0) {
      this.brightness -= 5
    }
    e.target.style.filter = `contrast(${this.constast}%) brightness(${this.brightness}%)`
  }
}
