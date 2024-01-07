export default class TaskBar {
  tasks = []
  constructor () {
    this.taskBarElement = document.querySelector('.taskbar')
    this.tasksDiv = this.taskBarElement.querySelector('.tasks')
    /**
     * Update the clock every second.
     */
    function startTime () {
      const today = new Date()
      let h = today.getHours()
      let m = today.getMinutes()
      let s = today.getSeconds()
      h = checkTime(h)
      m = checkTime(m)
      s = checkTime(s)
      const clock = document.querySelector('.clock')
      clock.innerHTML = h + ':' + m + ':' + s
      setTimeout(startTime, 1000)
    }

    /**
     * Adds zero in front of numbers < 10
     * @param {number} i The number
     * @returns {string} String with the zero added
     */
    function checkTime (i) {
      if (i < 10) { i = '0' + i }
      return i
    }
    startTime()
  }

  addTask (taskName, iconPath, clickHandler) {
    const task = document.createElement('div')
    task.classList.add('task')
    const img = document.createElement('img')
    img.setAttribute('src', iconPath)
    task.appendChild(img)
    this.tasks.push(task)
    this.tasksDiv.appendChild(task)
    task.addEventListener('click', clickHandler)
    return task
  }

  removeTask (task) {
    this.tasks.pop(task)
    task.remove()
  }
}
