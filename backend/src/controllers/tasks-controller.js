const Task = require('../models/tasks-models') 


//Controladores para gestionar CRUD de las tareas

exports.getAll = (req, res) => {
    res.json(Task.getTasks());
};

exports.getById = (req, res) => {
    const task = Task.getTaskById(req.userId, parseInt(req.params.id))
    if(!task) {
        return res.status(404).json({ error: 'Tarea no encontrada'});
    }
    res.json(task);
}

exports.create = (req, res) => {
    const { title, completed = false } = req.body;
    const newTask = Task.addTask({ title, completed, userId: req.userId });
    res.status(201).json(newTask);
}

exports.update = (req, res) => {
    const updated = Task.updateTask(req.UserId, parseInt(req.params.id), req.body)
    if(!updated) return res.status(404).json({ error: 'Tarea no encontrada'});
    res.json(updated);
}

exports.delete = (req, res) => {
    const deleted = Task.deleteTask(req.UserId, parseInt(req.params.id));
    if(!deleted) return res.status(404).json({ error: 'No se encontró la tarea' });
    res.status(204).send()
}
