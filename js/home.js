const form = document.getElementById("form");
const BASE_URL = 'https://60b77f8f17d1dc0017b8a2c4.mockapi.io';

// post todo 
form.addEventListener("submit", (e) => {
    e.preventDefault();

    let todoTitle = document.getElementById('title').value;
    let todoDescription = document.getElementById('description').value;
    let todoDueDate = document.getElementById('dueDate').value;
    let todoCreatedAt = new Date();
    todoCreatedAt.toUTCString();
    todoCreatedAt = Math.floor(todoCreatedAt.getTime()/ 1000);
    let todoUpdatedAt = new Date();
    todoUpdatedAt.toUTCString();
    todoUpdatedAt = Math.floor(todoUpdatedAt.getTime()/ 1000);
    let todoDetails = {
        title: todoTitle,
        description: todoDescription,
        dueDate: todoDueDate,
        createdAt: todoCreatedAt,
        updatedAt: todoUpdatedAt,
        checked: false
    }

    fetch(`${BASE_URL}/todos`, {
        method: 'post',
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(todoDetails)
    })
    .then(response => {
        if (response.ok) {
            let toastElList = [].slice.call(document.querySelectorAll('.toast'))
            let toastList = toastElList.map(function (toastEl) {
                return new bootstrap.Toast(toastEl)
            })
            toastList.forEach(toast => toast.show())
        }
    })
    .catch( (error) => {
        alert('Error: ' + error);
    })
    .finally( () => {
        form.reset();
    })
})

async function getTodos() {
    const res = await fetch(`${BASE_URL}/todos`);
    const data = await res.json();
    return data;
}

document.addEventListener('DOMContentLoaded', async () => {
    let todos = await getTodos();
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    let id = +urlParams.get('id');
    let saveTodo;
    
    todos.forEach(todo => {
        if (todo.id == id) {
            saveTodo = todo;
        } 
    })
    
    let todoTitle = document.getElementById('title');
    let todoDescription = document.getElementById('description');
    let todoDueDate = document.getElementById('dueDate');
    todoTitle.value = saveTodo.title;
    todoDescription.value = saveTodo.description;
    todoDueDate.value = saveTodo.dueDate;
    
    document.getElementById('addItem').style.display = 'none';
    document.getElementById('saveItem').style.display = 'block';
    
})

// edit todo
let saveBtn = document.getElementById('saveItem');
saveBtn.addEventListener('click', () => {

    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    let id = +urlParams.get('id');
    
    let todoTitle = document.getElementById('title');
    let todoDescription = document.getElementById('description');
    let todoDueDate = document.getElementById('dueDate');
    let todoUpdatedAt = new Date();
    todoUpdatedAt.toUTCString();
    todoUpdatedAt = Math.floor(todoUpdatedAt.getTime()/ 1000);

    let todoDetails = {
        title: todoTitle.value,
        description: todoDescription.value,
        dueDate: todoDueDate.value,
        updatedAt: todoUpdatedAt
    }

    fetch(`${BASE_URL}/todos/${id}`, {
        method: 'put',
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(todoDetails)
    })
    .then(response => {
        if (response.ok) {
            form.reset();
            window.history.replaceState({}, document.title, "/" + "home.html");
            let toastElList = [].slice.call(document.querySelectorAll('.toast'))
            let toastList = toastElList.map(function (toastEl) {
                return new bootstrap.Toast(toastEl)
            })
            toastList.forEach(toast => toast.show())
            document.getElementById('addItem').style.display = 'block';
            document.getElementById('saveItem').style.display = 'none';
        }
    })
    .catch( (error) => {
        alert('Error: ' + error);
    })
    .finally( () => {
    })
});