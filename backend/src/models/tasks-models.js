//Importaciones
const fs = require('fs');
const path = require('path');

const tasksPath = path.join(__dirname, '../database/tasks.json');

//Funcion para leer las tareas del archivo JSON
const getTasks = () => {
    return JSON.parse(fs.readFileSync(tasksPath, 'utf8'))
};

const getTaskById = (id) => {
    const tasks = getTasks();
    return tasks.find(task => task.id === id);
};

const saveTask = (tasks) => {
    // const tasks = getTasks();
    // tasks.push(task);
    fs.writeFileSync(tasksPath, JSON.stringify(tasks, null, 2), 'utf8') 
}

const addTask = (task) => {
    const tasks = getTasks();
    const newId = tasks.length + 1;
    const newTask = { id: newId,  ...task};
    tasks.push(newTask);
    saveTask(tasks);
    return newTask;
}

const deleteTask = (id) => {
    let tasks = getTasks();
    tasks = tasks.filter( task => task.id === id)
    saveTask(tasks)
}

const updateTask = (id, newTask) => {
    let tasks = getTasks();
    const index = tasks.filterIndex(task => task.id === id)
    if( index !== -1) {
        tasks[index] = { ...tasks[index], ...newTask };
        saveTask(tasks)
        return tasks[index]
    }
    return null
};


module.exports = { getTasks, getTaskById, saveTask, addTask, deleteTask, updateTask }