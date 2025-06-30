const Task = require('../models/tasks-models');

// Obtener todas las tareas del usuario
exports.getAll = (req, res) => {
    try {
        console.log('getAll - userId:', req.userId);
        const tasks = Task.getTasksByUser(req.userId);
        res.json({
            success: true,
            data: tasks
        });
    } catch (error) {
        console.error('Error obteniendo tareas:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Obtener una tarea específica por ID
exports.getById = (req, res) => {
    try {
        console.log('getById - userId:', req.userId, 'taskId:', req.params.id);
        const task = Task.getTaskById(req.userId, parseInt(req.params.id));
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Tarea no encontrada'
            });
        }
        res.json({
            success: true,
            data: task
        });
    } catch (error) {
        console.error('Error obteniendo tarea:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Crear una nueva tarea
exports.create = (req, res) => {
    try {
        const { title, description, priority = 'medium' } = req.body;
        
        console.log('create - userId:', req.userId, 'body:', req.body);
        
        if (!title || title.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El título de la tarea es requerido'
            });
        }

        if (!req.userId) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no autenticado'
            });
        }

        const newTask = Task.addTask({
            title: title.trim(),
            description: description || '',
            priority,
            status: 'todo',
            completed: false,
            userId: req.userId
        });

        res.status(201).json({
            success: true,
            message: 'Tarea creada exitosamente',
            data: newTask
        });
    } catch (error) {
        console.error('Error creando tarea:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Actualizar una tarea
exports.update = (req, res) => {
    try {
        const { title, description, priority, status } = req.body;
        const taskId = parseInt(req.params.id);

        console.log('update - userId:', req.userId, 'taskId:', taskId, 'body:', req.body);

        const updates = {};
        if (title !== undefined) updates.title = title.trim();
        if (description !== undefined) updates.description = description;
        if (priority !== undefined) updates.priority = priority;
        if (status !== undefined) {
            updates.status = status;
            updates.completed = status === 'done';
        }

        const updatedTask = Task.updateTask(req.userId, taskId, updates);
        
        if (!updatedTask) {
            return res.status(404).json({
                success: false,
                message: 'Tarea no encontrada'
            });
        }

        res.json({
            success: true,
            message: 'Tarea actualizada exitosamente',
            data: updatedTask
        });
    } catch (error) {
        console.error('Error actualizando tarea:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Eliminar una tarea
exports.delete = (req, res) => {
    try {
        const taskId = parseInt(req.params.id);
        console.log('delete - userId:', req.userId, 'taskId:', taskId);
        
        const deleted = Task.deleteTask(req.userId, taskId);
        
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Tarea no encontrada'
            });
        }

        res.json({
            success: true,
            message: 'Tarea eliminada exitosamente'
        });
    } catch (error) {
        console.error('Error eliminando tarea:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Actualizar el status de una tarea (para drag and drop)
exports.updateStatus = (req, res) => {
    try {
        const { status } = req.body;
        const taskId = parseInt(req.params.id);

        console.log('updateStatus - userId:', req.userId, 'taskId:', taskId, 'status:', status);

        if (!status || !['todo', 'inProgress', 'done'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status inválido. Debe ser: todo, inProgress, o done'
            });
        }

        const updatedTask = Task.updateTaskStatus(req.userId, taskId, status);
        
        if (!updatedTask) {
            return res.status(404).json({
                success: false,
                message: 'Tarea no encontrada'
            });
        }

        res.json({
            success: true,
            message: 'Status de tarea actualizado exitosamente',
            data: updatedTask
        });
    } catch (error) {
        console.error('Error actualizando status de tarea:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
