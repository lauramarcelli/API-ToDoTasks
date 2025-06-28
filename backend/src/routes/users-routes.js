const express = require('express');
const router = express.Router()
const validatePassword = require('../middlewares/validate-middleware')
const userController = require('../controllers/users-controller');

router.post('/register', validatePassword.auth, userController.registerUser);
router.post('/login', validatePassword.auth, userController.loginUser)


module.exports = router