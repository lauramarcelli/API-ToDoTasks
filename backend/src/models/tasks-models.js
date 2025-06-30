//Importaciones
const fs = require('fs');
const path = require('path');

const tasksPath = path.join(__dirname, '../database/tasks.json');

// Función para leer las tareas del archivo JSON
function getTasks() {
    try {
        if (!fs.existsSync(tasksPath)) {
            // Si el archivo no existe, crear uno vacío
            fs.writeFileSync(tasksPath, JSON.stringify([], null, 2));
            return [];
        }
        const data = fs.readFileSync(tasksPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error leyendo tareas:', error);
        // Si hay error, crear un archivo nuevo
        fs.writeFileSync(tasksPath, JSON.stringify([], null, 2));
        return [];
    }
}

// Función para obtener el siguiente ID disponible
function getNextId() {
    const tasks = getTasks();
    if (tasks.length === 0) {
        return 1;
    }
    const maxId = Math.max(...tasks.map(task => task.id));
    return maxId + 1;
}

function getTasksByUser(userId) {
    const tasks = getTasks();
    return tasks.filter(t => t.userId === userId);
}

function getTaskById(userId, id) {
    const tasks = getTasks();
    return tasks.find(task => task.id === id && task.userId === userId);
}

function saveTasks(tasks) {
    try {
        // Asegurar que el directorio existe
        const dir = path.dirname(tasksPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(tasksPath, JSON.stringify(tasks, null, 2), 'utf8');
        console.log('Tareas guardadas exitosamente');
    } catch (error) {
        console.error('Error guardando tareas:', error);
        throw error;
    }
}

function addTask(task) {
    const tasks = getTasks();
    const newId = getNextId(); // Usar contador incremental
    const newTask = { 
        id: newId, 
        ...task,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    tasks.push(newTask);
    saveTasks(tasks);
    
    console.log('Nueva tarea agregada:', { id: newTask.id, title: newTask.title, userId: newTask.userId });
    return newTask;
}

function deleteTask(userId, id) {
    let tasks = getTasks();
    const initialLength = tasks.length;
    tasks = tasks.filter(task => !(task.id === id && task.userId === userId));
    
    if (tasks.length === initialLength) {
        return false;
    }
    
    saveTasks(tasks);
    console.log('Tarea eliminada:', { id, userId });
    return true;
}

function updateTask(userId, id, newTask) {
    let tasks = getTasks();
    const index = tasks.findIndex(task => task.id === id && task.userId === userId);
    
    if (index !== -1) {
        tasks[index] = { 
            ...tasks[index], 
            ...newTask,
            updatedAt: new Date().toISOString()
        };
        saveTasks(tasks);
        
        console.log('Tarea actualizada:', { id, userId, title: tasks[index].title });
        return tasks[index];
    }
    
    return null;
}

// Función para actualizar el status de una tarea (para drag and drop)
function updateTaskStatus(userId, id, status) {
    return updateTask(userId, id, { status, completed: status === 'done' });
}

module.exports = { 
    getTasks, 
    getTaskById, 
    getTasksByUser, 
    saveTasks, 
    addTask, 
    deleteTask, 
    updateTask,
    updateTaskStatus
}