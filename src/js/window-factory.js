export default class WindowFactory {
  createWindow (title, width, height, scaleble, contents) {
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
    windowElement.style.width = width
    windowElement.style.height = height
    windowElement.appendChild(bar)
    windowElement.appendChild(contents)

    // Add scaler element
    if (scaleble) {
      const resizer = document.createElement('button')
      resizer.innerText = '>'
      resizer.draggable = true
      resizer.classList.add('scaler')
      resizer.addEventListener('dragstart', (event) => {
        event.target.classList.add('scalling')
      })
      resizer.addEventListener('dragend', (event) => {
        event.target.classList.remove('scalling')
      })
      windowElement.appendChild(resizer)
    }

    // Listen to the events
    bar.addEventListener('dragstart', this.dragStartHandler)
    bar.addEventListener('dragend', this.dragEndHandler)
    bar.addEventListener('click', this.clickHandler)
    return windowElement
  }

  /**
   * The event handler for the dragstart event.
   * @param {Event} event The event object.
   */
  dragStartHandler (event) {
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
    const target = event.target.parentNode.parentNode
    // Move the dragged window to the bottom of the dom tree
    while (target.nextElementSibling != null) {
      target.parentNode.insertBefore(target.nextElementSibling, target)
    }
  }
}
