// Selecting elements
const input = document.getElementById('todo');
const addButton = document.getElementById('add-btn');
const deleteAllButton = document.getElementById('delete-all-btn');
const darkModeButton = document.getElementById('dark-mode-btn');
const logoutButton = document.getElementById('logout-btn');
const todoList = document.getElementById('todo-list');

// Initialize todo array from local storage or empty array
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// Initialize a stack to store previous states for undo
let undoStack = [];

// Function to perform undo
function undo() {
    if (undoStack.length > 0) {
        todos = undoStack.pop();
        localStorage.setItem('todos', JSON.stringify(todos));
        renderTodoList();
    } else {
        alert('Nothing to undo!');
    }
}

// Function to perform an action with undo support
function withUndo(action) {
    // Make a deep copy of todos array to store in the undo stack
    const previousState = JSON.parse(JSON.stringify(todos));
    action(); // Perform the action
    undoStack.push(previousState); // Store the previous state in the undo stack
}

// Function to render todos
function renderTodoList(todosToRender = todos) {
    // Clear existing list
    todoList.innerHTML = '';

    // Render each todo item
    todosToRender.forEach((todo, index) => {
        const todoItem = document.createElement('li');

        // Create checkbox for marking as complete
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed || false;
        checkbox.addEventListener('change', () => toggleTodoComplete(index));

        // Create span element to display todo text
        const todoText = document.createElement('span');
        todoText.textContent = todo.text;

        // Append checkbox and todo text to todo item
        todoItem.appendChild(checkbox);
        todoItem.appendChild(todoText);

        // Create buttons for delete and edit
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.classList.add('delete-btn');
        deleteButton.addEventListener('click', () => deleteTodoItem(index));

        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="fas fa-edit"></i>';
        editButton.classList.add('edit-btn');
        editButton.addEventListener('click', () => editTodoItem(index));

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('todo-buttons');
        buttonContainer.appendChild(deleteButton);
        buttonContainer.appendChild(editButton);

        todoItem.appendChild(buttonContainer);
        todoList.appendChild(todoItem);
    });
}

// Function to add a new todo
function addTodo() {
    const todoText = input.value.trim();
    if (todoText) {
        withUndo(() => {
            todos.push({ text: todoText, completed: false });
            localStorage.setItem('todos', JSON.stringify(todos));
            input.value = '';
            renderTodoList();
        });
    }
}

// Function to delete a todo item
function deleteTodoItem(index) {
    withUndo(() => {
        todos.splice(index, 1);
        localStorage.setItem('todos', JSON.stringify(todos));
        renderTodoList();
    });
}

// Function to edit a todo item
function editTodoItem(index) {
    const editedTodo = prompt('Enter the new value', todos[index].text);
    if (editedTodo !== null) {
        withUndo(() => {
            todos[index].text = editedTodo.trim();
            localStorage.setItem('todos', JSON.stringify(todos));
            renderTodoList();
        });
    }
}

// Function to toggle todo completion
function toggleTodoComplete(index) {
    withUndo(() => {
        todos[index].completed = !todos[index].completed;
        localStorage.setItem('todos', JSON.stringify(todos));
        renderTodoList();
    });
}

// Function to delete all todos
function deleteAllTodos() {
    withUndo(() => {
        todos = [];
        localStorage.removeItem('todos');
        renderTodoList();
    });
}

// Function to toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

// Initial rendering
renderTodoList();

// Event listeners
addButton.addEventListener('click', addTodo);
deleteAllButton.addEventListener('click', deleteAllTodos);
darkModeButton.addEventListener('click', toggleDarkMode);
logoutButton.addEventListener('click', () => {
    // Implement logout functionality
});
undoButton.addEventListener('click', undo); 
