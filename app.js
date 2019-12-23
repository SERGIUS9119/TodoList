
 
class Todo {
    constructor(task, description, priority) {
        this.task = task;
        this.description = description;
        this.priority = priority;
    }
}
 

class UI {
    static displayTodos() {
        const todos = Store.getTodos();
        const list = document.querySelector('#todo-list');
        list.innerHTML = '';
        todos.forEach((todo, i) => UI.addTodoToList(todo, i));
    }
 
    static addTodoToList(todo, i) {
        const list = document.querySelector('#todo-list');
        const row = document.createElement('tr');
 
        row.innerHTML = `
            <td>${todo.task}</td>
            <td>${todo.description}</td>
            <td>${todo.priority}</td>
            <td><a href="#" class="btn btn-sm edit" data-index="${i}">&#10004</a></td>
            <td><a href="#" class="btn btn-sm delete" data-index="${i}">&times;</a></td>
            `;
 
            list.appendChild(row);
    }
 
    static deleteTodo(el) {
        if(el.classList.contains('delete')) {
            const index = el.dataset.index;
            Store.removeTodo(index);
        }
    }
    static editTodo(el) {
        if(el.classList.contains('edit'))   {
            const index = el.dataset.index;
            const todos = Store.getTodos();
            const todo = todos[index];
            ['task', 'description', 'priority'].forEach(id => document.querySelector(`#${id}`).value = todo[id]);
            const btn = document.querySelector('#todo-form [type="submit"]');
            btn.value = 'Изменить данные';
            btn.dataset.index = index;
        }
    }
 
 
    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#todo-form');
        container.insertBefore(div, form);
 
    
    setTimeout(() => document.querySelector('.alert').remove(), 2000);
}
 
    static clearFields(){
        document.querySelector('#task').value = '';
     document.querySelector('#description').value = '';
        document.querySelector('#priority').value = '';
        const btn = document.querySelector('#todo-form [type="submit"]');
        btn.removeAttribute('data-index');
        btn.value = 'Добавить задачу';
    }
}
 

class Store {
    static getTodos() {
        let todos;
        if(localStorage.getItem('todos') === null) {
            todos = [];
        } else {
            todos = JSON.parse(localStorage.getItem('todos'));
        }
 
        return todos;
    }
 
    static addTodo(todo) {
        const todos = Store.getTodos();
        todos.push(todo);
        localStorage.setItem('todos', JSON.stringify(todos));
        UI.displayTodos();
    }
 
    static removeTodo(index) {
        const todos = Store.getTodos();
        todos.splice(index, 1);
        localStorage.setItem('todos', JSON.stringify(todos));
        UI.displayTodos();
    }
}
 

document.addEventListener('DOMContentLoaded', UI.displayTodos); 

document.querySelector('#todo-form').addEventListener('submit', (e) => {
    
    e.preventDefault();
 

const task = document.querySelector('#task').value;
const description = document.querySelector('#description').value;
const priority = document.querySelector('#priority').value;
 
const btn = document.querySelector('#todo-form [type="submit"]');
const index = btn.dataset.index;

if(task === '' || description === '' || priority === '') {
    UI.showAlert('Пожалуйста введите данные', 'danger');
}
else if(index !== void 0){
    const todo = new Todo(task, description, priority);
    const todos = Store.getTodos();
    todos[index] = todo;
    localStorage.setItem('todos', JSON.stringify(todos));
    UI.displayTodos();
    UI.showAlert(`Задача ${index} изменена `, 'success');
    UI.clearFields();
}
 
else {
    
    const todo = new Todo(task, description, priority);
 
    
    UI.addTodoToList(todo); 
    
    Store.addTodo(todo); 
    
    UI.showAlert('Задача добавлена', 'success'); 
    
    UI.clearFields();
}
}); 

document.querySelector('#todo-list').addEventListener('click', (e) => {
    UI.deleteTodo(e.target);
    UI.editTodo(e.target);
 });