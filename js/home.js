let form = document.getElementById("form");
const BASE_URL = 'https://60b77f8f17d1dc0017b8a2c4.mockapi.io';

// post todo 
form.addEventListener("submit", (e) => {
    e.preventDefault();

    let todoTitle = document.getElementById('title').value;
    let todoDescription = document.getElementById('description').value;
    let todoDueDate = document.getElementById('dueDate').value;
    let todoCreatedAt = new Date().toLocaleDateString('en');
    let todoUpdatedAt = new Date().toLocaleDateString('en');
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

// edit todo
let saveBtn = document.getElementById('saveItem');
saveBtn.addEventListener('click', editTodo());

async function editTodo() {

    let todos = await getTodos();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');
    let saveTodo;
    todos.forEach(todo => {
        if (todo.id == id) {
            saveTodo = todo;
            console.log(saveTodo);
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
    let todoDetails = {
        title: todoTitle.value,
        description: todoDescription.value,
        dueDate: todoDueDate.value
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
}