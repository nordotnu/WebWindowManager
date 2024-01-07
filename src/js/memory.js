import Application from './application'

export default class Memory extends Application {
  static appName = 'Memory Game'
  static id = 'memory-game'
  static icon = '../img/memory.svg'
  static width = 400
  static height = 500
  static scaleble = false

  getApplicationElement () {
    this.appBody = super.getApplicationElement()
    // this.wmWindow.resizeWindow(100, 100)
    return this.appBody
  }
}
