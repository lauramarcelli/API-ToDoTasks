const express = require('express');
const router = express.Router()
const validatePassword = require('../middlewares/validate-middleware')
const userController = require('../controllers/users-controller');

// Rutas de autenticación
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

module.exports = router