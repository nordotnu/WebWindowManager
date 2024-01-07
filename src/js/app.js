import Application from './application'
import Desktop from './desktop'
import Memory from './memory'

window.addEventListener('load', main)

/**
 * The main function.
 */
function main () {
  const desktop = new Desktop()
  desktop.registerApp(Memory)
}
