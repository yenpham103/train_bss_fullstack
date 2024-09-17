const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const clearBtn = document.getElementById('clear-btn');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');
    if (task.completed) {
      taskElement.classList.add('completed');
    }
    taskElement.innerHTML = `
    <div class="task-header">
        <input type="checkbox" class="task-checkbox" ${
          task.completed ? 'checked' : ''
        } onchange="toggleComplete(${index})">
        <span class="task-title">${escapeHtml(task.title)}</span>
        <div class="task-buttons">
            <button type="submit" onclick="editTask(${index})">
                <span class="button-text">Edit</span>
                <i class="fas fa-edit button-icon"></i>
            </button>
            <button type="button" onclick="deleteTask(${index})">
                <span class="button-text">Delete</span>
                <i class="fas fa-trash button-icon"></i>
            </button>
        </div>
    </div>
    <div class="task-description">${
      !task.completed ? escapeHtml(task.description) : ''
    }</div>
    ${
      task.editing
        ? `
        <div class="edit-form">
            <input type="text" id="edit-title-${index}" value="${escapeHtml(
            task.title
          )}">
            <textarea rows="5" id="edit-description-${index}">${escapeHtml(
            task.description
          )}</textarea>
            <button type="submit" onclick="saveEdit(${index})">
                <span class="button-text">Save</span>
                <i class="fas fa-save button-icon"></i>
            </button>
        </div>
    `
        : ''
    }
`;
    taskList.appendChild(taskElement);
  });
  saveTasks();
}

function addTask(title, description) {
  tasks.unshift({ title, description, completed: false, editing: false });
  renderTasks();
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}

function editTask(index) {
  tasks[index].editing = !tasks[index].editing;
  renderTasks();
}

function saveEdit(index) {
  const newTitle = document.getElementById(`edit-title-${index}`).value;
  const newDescription = document.getElementById(
    `edit-description-${index}`
  ).value;
  tasks[index].title = newTitle;
  tasks[index].description = newDescription;
  tasks[index].editing = false;
  renderTasks();
}

function deleteTask(index) {
  const isConfirmed = confirm('Are you sure you want to delete this task?');

  if (isConfirmed) {
    tasks = tasks.filter((task, i) => i !== index);
    renderTasks();
  }
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('task-title').value;
  const description = document.getElementById('task-description').value;
  addTask(title, description);
  taskForm.reset();
  document.getElementById('task-title').focus();
});

clearBtn.addEventListener('click', () => {
  taskForm.reset();
});

renderTasks();
