import Camera from './camera'
import Chat from './chat'
import Desktop from './desktop'
import Memory from './memory'
import Paint from './paint'

window.addEventListener('load', main)

/**
 * The main function.
 */
function main () {
  const desktop = new Desktop()
  desktop.registerApp(Memory)
  desktop.registerApp(Chat)
  desktop.registerApp(Camera)
  desktop.registerApp(Paint)
}
