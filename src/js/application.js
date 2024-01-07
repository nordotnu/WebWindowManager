export default class Application {
  static appName = 'My App'
  static id = 'my-app'
  static icon = '../img/default.svg'
  static width = 300
  static height = 600
  static scaleble = false

  constructor (wmWindow) {
    this.wmWindow = wmWindow
  }

  getApplicationElement () {
    const app = Object.getPrototypeOf(this).constructor
    if (app === Application) return document.createElement('i')
    const template = document.querySelector('#' + app.id)
    const appBody = template.content.cloneNode(true)
    return appBody
  }
}
