const BASE_URL = 'https://60b77f8f17d1dc0017b8a2c4.mockapi.io';

// get todos
// async function getTodos() {
//     const res = await fetch(`${BASE_URL}/todos`);
//     const data = await res.json();
//     return data;
// }

let todos;

// load todos
document.addEventListener('DOMContentLoaded', async () => {
    async function getTodos() {
        const res = await fetch(`${BASE_URL}/todos`);
        const data = await res.json();
        return data;
    }
    
    todos = await getTodos();

    function loadTodos(){
        let currentPage = 0;
        let pages = "";
        let page_size = 10;
        pages = paginate(todos, page_size);
        let pageLi = "";

        pages.forEach((element, index) => {
            if (index != 0) {  
                pageLi += `<li onclick="pageChange(${index})" id="page_${index}" class="page-item list-item"><a class="page-link" href="javascript:void(0)">${index}</a></li>`;
            }
        });

        document.querySelector('.page-item.page-list').after(pageLi);
        let page = pages[currentPage];
        printRows(page);

        function nextPage() {
            if (pages.length - 1 > currentPage) 
                page = currentPage + 1;
            pageChange(page);
        }

        function prePage() {
            if (currentPage < pages.length && currentPage != 0) 
                page = currentPage - 1;
            pageChange(page);
        }

        function pageChange(page) {
            currentPage = page;
            document.querySelector('.list-item').removeClass('active');
            document.querySelector('#page_' + page).addClass('active');
            document.querySelector('.page-data').html('');
            page = pages[page];
            printRows(page);
        }

        function printRows(arr) {
            arr.forEach(todo => {
                const list = document.getElementById('todosList');
                const li = document.createElement("li");
                li.innerHTML = `
                    <div class="todo_heading">
                        <input type="checkbox" onclick="todoComplete(this)" class="check" ${todo.checked ? 'checked' : ''}>
                        <input type="text" readonly value="${todo.title}"
                            class="todo_title ${todo.checked ? 'complete' : ''}">
                        <input type="date" readonly value="${todo.dueDate}" class="todo_dueDate">
                        <i class="fas fa-pencil-alt" onclick="editTodo(${todo.id})"></i>
                        <i class="fas fa-trash-alt" onclick="removeTodo(${todo.id}, this)"></i>
                    </div>
                    <p id="todo_description">${todo.description}</p>
                `;
                list.insertBefore(li, list.children[0]);
            });
        }

        function paginate (arr, size) {
            return arr.reduce((acc, val, i) => {
                let idx = Math.floor(i / size)
                let page = acc[idx] || (acc[idx] = [])
                page.push(val)
                return acc
            }, [])
        }
        // getTodos().then(todos => {
        //     todos.forEach(todo => {
        //         const list = document.getElementById('todosList');
        //         const li = document.createElement("li");
        //         li.innerHTML = `
        //             <div class="todo_heading">
        //                 <input type="checkbox" onclick="taskComplete(this)" class="check" ${todo.checked ? 'checked' : ''}>
        //                 <input type="text" readonly value="${todo.title}"
        //                     class="todo_title ${todo.checked ? 'complete' : ''}">
        //                 <input type="date" readonly value="${todo.dueDate}" class="todo_dueDate">
        //                 <i class="fas fa-pencil-alt" onclick="editTask(${todo.id})"></i>
        //                 <i class="fas fa-trash-alt" onclick="removeTask(${todo.id}, this)"></i>
        //             </div>
        //             <p id="todo_description">${todo.description}</p>
        //         `;
        //         list.insertBefore(li, list.children[0]);
        //     });
        // });
    }
    loadTodos();
});

// complete todo
function todoComplete(event) {
    let id;
    // getTodos().then(todos => {
        todos.forEach(todo => { 
            if (todo.title === event.nextElementSibling.value) {
                id = todo.id;
                todo.checked = !todo.checked;
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
                }else{
                    event.nextElementSibling.classList = 'todo_title';
                }
            }
        });
    // });
}

// remove todo
async function removeTodo(id, target) {
    // console.log(id);
    // showPrompt();
    
    // function showCover() {
    //     let coverDiv = document.createElement('div');
    //     coverDiv.id = 'cover-div';
        
    //     document.body.style.overflowY = 'hidden';
        
    //     document.body.append(coverDiv);
    // }

    // function hideCover() {
    //     document.getElementById('cover-div').remove();
    //     document.body.style.overflowY = '';
    // }
    
    // function showPrompt() {
    //     showCover();
    //     let form = document.getElementById('prompt-form');
    //     let container = document.getElementById('prompt-form-container');
    //     document.getElementById('title').value = title;
    //     document.getElementById('dueDate').value = dueDate;
        
    //     function complete() {
    //         hideCover();
    //         container.style.display = 'none';
    //     }
        
    //     form.onsubmit = async () => {
    //         complete();
            const res = await fetch(`${BASE_URL}/todos/${id}`, { method: "delete" });
            target.parentElement.parentElement.remove();
    //     };
        
    //     form.cancel.onclick = function() {
    //         hideCover();
    //         container.style.display = 'none';
    //     };
        
    //     container.style.display = 'block';
    // }
}

// edit todo
function editTodo(todoId) {
    const params = new URLSearchParams({ id: todoId});
    const query = params.toString();
    window.location.href = `home.html?${query}`;
}