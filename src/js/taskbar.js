export default class TaskBar {
  tasks = []
  constructor () {
    this.taskBarElement = document.querySelector('.taskbar')
    this.tasksDiv = this.taskBarElement.querySelector('.tasks')
    this.taskBarElement.style.backgroundColor = 'red'
  }

  addTask (taskName, clickHandler) {
    const task = document.createElement('button')
    task.classList.add('task')
    task.innerText = taskName
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
