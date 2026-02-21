// Protect page: redirect if not logged in
const token = localStorage.getItem("token");
if (!token) window.location.href = "login.html";

const messageDiv = document.getElementById("message");

// --------------------
// Load todos
// --------------------
async function loadTodos() {
  const table = document.getElementById("todoTable");
  if (!table) return;

  const res = await fetch(`${BASE_URL}/api/todos`, {
    headers: { Authorization: token }
  });

  if (!res.ok) {
    showMessage("Failed to load todos", "red");
    return;
  }

  const todos = await res.json();
  table.innerHTML = "";

  todos.forEach(todo => {
    const tr = document.createElement("tr");
    tr.dataset.id = todo._id;
    tr.innerHTML = `
      <td>${todo.title}</td>
      <td>${todo.description}</td>
      <td>${new Date(todo.createdAt).toLocaleString()}</td>
      <td>${new Date(todo.updatedAt).toLocaleString()}</td>
      <td>
        <button class="btn editBtn">Edit</button>
        <button class="btn deleteBtn">Delete</button>
      </td>
    `;
    table.appendChild(tr);
  });

  attachRowEvents();
}

// --------------------
// Attach events for edit & delete buttons
// --------------------
function attachRowEvents() {
  document.querySelectorAll(".editBtn").forEach(btn => {
    btn.onclick = () => {
      const tr = btn.closest("tr");
      editTodoInline(tr);
    };
  });

  document.querySelectorAll(".deleteBtn").forEach(btn => {
    btn.onclick = () => {
      const tr = btn.closest("tr");
      deleteTodo(tr.dataset.id);
    };
  });
}

// --------------------
// Add new todo
// --------------------
const form = document.getElementById("todoForm");
if (form) {
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;

    const res = await fetch(`${BASE_URL}/api/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify({ title, description })
    });

    if (res.ok) {
      showMessage("Task added successfully!", "green");
      form.reset();
      loadTodos();
    } else {
      showMessage("Failed to add task", "red");
    }
  });
}

// --------------------
// Delete todo
// --------------------
async function deleteTodo(id) {
  const res = await fetch(`${BASE_URL}/api/todos/${id}`, {
    method: "DELETE",
    headers: { Authorization: token }
  });

  if (res.ok) {
    showMessage("Task deleted successfully!", "green");
    loadTodos();
  } else {
    showMessage("Failed to delete task", "red");
  }
}

// --------------------
// Edit todo inline
// --------------------
function editTodoInline(tr) {
  const titleTd = tr.children[0];
  const descTd = tr.children[1];
  const actionsTd = tr.children[4];

  const oldTitle = titleTd.textContent;
  const oldDesc = descTd.textContent;

  titleTd.innerHTML = `<input type="text" value="${oldTitle}" />`;
  descTd.innerHTML = `<input type="text" value="${oldDesc}" />`;

  actionsTd.innerHTML = `
    <button class="btn saveBtn">Save</button>
    <button class="btn cancelBtn">Cancel</button>
  `;

  // Save
  actionsTd.querySelector(".saveBtn").onclick = async () => {
    const newTitle = titleTd.querySelector("input").value;
    const newDesc = descTd.querySelector("input").value;

    if (!newTitle || !newDesc) return;

    const res = await fetch(`${BASE_URL}/api/todos/${tr.dataset.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify({ title: newTitle, description: newDesc })
    });

    if (res.ok) {
      showMessage("Task updated successfully!", "green");
      loadTodos();
    } else {
      showMessage("Failed to update task", "red");
    }
  };

  // Cancel
  actionsTd.querySelector(".cancelBtn").onclick = () => {
    loadTodos();
  };
}

// --------------------
// Message helper
// --------------------
function showMessage(msg, color) {
  messageDiv.textContent = msg;
  messageDiv.style.color = color;
  setTimeout(() => { messageDiv.textContent = ""; }, 3000);
}

// --------------------
// Initial load
// --------------------
loadTodos();