const BASE_URL = 'https://60b77f8f17d1dc0017b8a2c4.mockapi.io';
let todos;

// load todos
document.addEventListener('DOMContentLoaded', async () => {
    async function getTodos() {
        const res = await fetch(`${BASE_URL}/todos`);
        const data = await res.json();
        return data;
    }

    todos = await getTodos();
    
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    let emptyPage = +urlParams.get('page');
    
    if (emptyPage > todos.length / 10) {
        window.location.href = 'notFound.html';
    }
    
    let current_page = 1;
    const rows = 10;
    const list_element = document.getElementById('todosList');
    const pagination_element = document.getElementById('pagination');

    function DisplayList(items, wrapper, rows_per_page, page) {
        wrapper.innerHTML = "";
        window.history.replaceState({}, document.title, "/" + `todos.html?page=${page}`);
        page--;

        let start = rows_per_page * page;
        let end = start + rows_per_page;
        let paginatedItems = items.slice(start, end);

        for (let i = 0; i < paginatedItems.length; i++) {
            let item = paginatedItems[i];

            let item_element = document.createElement('li');
            item_element.innerHTML = `
                <div class="todo_heading">
                    <input type="checkbox" onclick="todoComplete(this)" class="check" ${item.checked ? 'checked' : ''}>
                    <input type="text" readonly value="${item.title}" class="todo_title ${item.checked ? 'complete' : ''}">
                    <input type="date" readonly value="${item.dueDate}" class="todo_dueDate">
                    <i class="fas fa-pencil-alt" onclick="editTodo(${item.id})"></i>
                    <i class="fas fa-trash-alt" onclick="removeTodo(${item.id}, this)"></i>
                </div>
                <p id="todo_description">${item.description}</p>
            `;

            wrapper.appendChild(item_element);
        }
    }

    function SetupPagination(items, wrapper, rows_per_page) {
        wrapper.innerHTML = "";
        let page_count = Math.ceil(items.length / rows_per_page);
        for (let i = 1; i < page_count + 1; i++) {
            let btn = PaginationButton(i, items);
            wrapper.appendChild(btn);
        }
    }

    function PaginationButton(page, items) {
        let button = document.createElement('button');
        button.innerText = page;

        if (current_page == page) button.classList.add('active');

        button.addEventListener('click', function () {
            current_page = page;
            DisplayList(items, list_element, rows, current_page);

            let current_btn = document.querySelector('.pagenumbers button.active');
            current_btn.classList.remove('active');

            button.classList.add('active');
        });
        return button;
    }

    DisplayList(todos, list_element, rows, current_page);
    SetupPagination(todos, pagination_element, rows);
});

// complete todo
function todoComplete(event) {
    let id;

    todos.forEach(todo => {
        if (todo.title === event.nextElementSibling.value) {
            id = todo.id;
            todo.checked = !todo.checked;
            todo.updatedAt = new Date();
            todo.updatedAt.toUTCString();
            todo.updatedAt = Math.floor(todo.updatedAt.getTime() / 1000);
            const completeTodo = {
                title: todo.title,
                description: todo.description,
                dueDate: todo.dueDate,
                createdAt: todo.createdAt,
                updatedAt: todo.updatedAt,
                checked: todo.checked
            };
            fetch(`${BASE_URL}/todos/${id}`, {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": "token-value",
                },
                body: JSON.stringify(completeTodo),
            });
            if (todo.checked) {
                event.nextElementSibling.classList.toggle("complete");
            } else {
                event.nextElementSibling.classList = 'todo_title';
            }
        }
    });
}

// remove todo
function removeTodo(id, target) {
    let removeTodo;
    let delBtn = document.getElementById('deleteBtn');
    let modal = document.getElementById('prompt-form-container');
    modal.style.display = 'block';
    todos.forEach(todo => {
        if (todo.id == id) {
            removeTodo = todo;
        }
    });
    document.getElementById('title').value = removeTodo.title;
    document.getElementById('dueDate').value = removeTodo.dueDate;
    delBtn.addEventListener('click', async () => {
        await fetch(`${BASE_URL}/todos/${id}`, {
            method: "delete"
        });
        target.parentElement.parentElement.remove();
        modal.style.display = 'none';
    })

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

// edit todo
function editTodo(todoId) {
    let params = new URLSearchParams({
        id: todoId
    });
    let query = params.toString();
    window.location.href = `home.html?${query}`;
}