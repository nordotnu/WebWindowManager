import Desktop from './desktop'

window.addEventListener('load', main)

/**
 * The main function.
 */
function main () {
  const desktop = new Desktop()
  desktop.addWindow('First Window')
  desktop.addWindow('Second Window')
  desktop.addWindow('Third Window')
}
