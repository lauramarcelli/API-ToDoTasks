//Rutas
const express = require('express');
const router = express.Router()
const controller = require('../controllers/tasks-controller');

router.get('/', controller.getAll)
router.get('/:id', controller.getById);
router.post('/', controller.create)
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

// Ruta específica para actualizar status (drag and drop)
router.patch('/:id/status', controller.updateStatus);

module.exports = router;