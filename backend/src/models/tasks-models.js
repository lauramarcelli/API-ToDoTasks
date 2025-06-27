//Importaciones
const fs = require('fs');
const path = require('path');

const tasksPath = path.join(__dirname, '../database/tasks.json');

//Funcion para leer las tareas del archivo JSON
function getTasks () {
    return JSON.parse(fs.readFileSync(tasksPath, 'utf8'))
};

function getTasksByUser(userId){
    const tasks = getTasks()
    return tasks.filter(t => t.userId === userId)
}

function getTaskById (userId, id) {
    const tasks = getTasks();
    return tasks.find(task => task.id === id &&task.userId === userId);
};

function saveTask (tasks) {
    fs.writeFileSync(tasksPath, JSON.stringify(tasks, null, 2), 'utf8') 
}

function addTask (task) {
    const tasks = getTasks();
    const newId = tasks.length + 1;
    const newTask = { id: newId,  ...task};
    tasks.push(newTask);
    saveTask(tasks);
    return newTask;
}

function deleteTask (userId, id) {
    let tasks = getTasks();
    tasks = tasks.filter( task => !(task.id === id && task.userId === userId))
    saveTask(tasks)
}

function updateTask (userId, id, newTask) {
    let tasks = getTasks();
    const index = tasks.findIndex(task => task.id === id && task.userId === userId)
    if( index !== -1) {
        tasks[index] = { ...tasks[index], ...newTask };
        saveTask(tasks)
        return tasks[index]
    }
    return null
};


module.exports = { getTasks, getTaskById, getTasksByUser, saveTask, addTask, deleteTask, updateTask }