
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskCategory = document.getElementById("taskCategory");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const filterTasks = document.getElementById("filterTasks");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

// Load saved tasks from the browser
let tasks = [];

try {
  const savedTasks = JSON.parse(
    localStorage.getItem("studyTaskManagerTasks") || "[]"
  );

  if (Array.isArray(savedTasks)) {
    tasks = savedTasks.filter(task =>
      task &&
      typeof task.id === "string" &&
      typeof task.title === "string" &&
      typeof task.date === "string" &&
      typeof task.category === "string" &&
      typeof task.completed === "boolean"
    );
  }
} catch (error) {
  tasks = [];
}

// Save tasks in the browser
function saveTasks() {
  try {
    localStorage.setItem(
      "studyTaskManagerTasks",
      JSON.stringify(tasks)
    );
  } catch (error) {
    alert("Unable to save tasks in this browser.");
  }
}

// Update the task counters
function updateStats() {
  const completed = tasks.filter(task => task.completed).length;

  totalTasks.textContent = tasks.length;
  completedTasks.textContent = completed;
  pendingTasks.textContent = tasks.length - completed;
}

// Display tasks on the page
function displayTasks() {
  taskList.replaceChildren();

  const filter = filterTasks.value;

  const visibleTasks = tasks.filter(task => {
    if (filter === "pending") {
      return !task.completed;
    }

    if (filter === "completed") {
      return task.completed;
    }

    return true;
  });

  emptyMessage.style.display =
    visibleTasks.length === 0 ? "block" : "none";

  visibleTasks.forEach(task => {
    const item = document.createElement("article");
    item.className = "task-item";

    if (task.completed) {
      item.classList.add("completed");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute(
      "aria-label",
      "Mark " + task.title + " as completed"
    );

    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      displayTasks();
    });

    const info = document.createElement("div");
    info.className = "task-info";

    const title = document.createElement("h3");
    title.textContent = task.title;

    const details = document.createElement("p");
    details.textContent =
      task.category + " • Due: " + task.date;

    info.append(title, details);

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute(
      "aria-label",
      "Delete " + task.title
    );

    deleteButton.addEventListener("click", () => {
      tasks = tasks.filter(savedTask => savedTask.id !== task.id);
      saveTasks();
      displayTasks();
    });

    item.append(checkbox, info, deleteButton);
    taskList.appendChild(item);
  });

  updateStats();
}

// Add a new task
taskForm.addEventListener("submit", event => {
  event.preventDefault();

  const title = taskInput.value.trim();
  const date = taskDate.value;

  if (!title || !date) {
    alert("Please enter a task name and due date.");
    return;
  }

  tasks.push({
    id: crypto.randomUUID(),
    title: title,
    date: date,
    category: taskCategory.value,
    completed: false
  });

  saveTasks();
  taskForm.reset();
  displayTasks();
});

// Filter tasks
filterTasks.addEventListener("change", displayTasks);

// Show saved tasks when the page opens
displayTasks();
