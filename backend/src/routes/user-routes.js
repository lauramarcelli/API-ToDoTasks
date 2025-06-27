const express = require('express');
const router = express.Router()
const validatePassword = require('../middlewares/validate-middleware')
const userController = require('../controllers/user-controller');

router.post('/register', validatePassword.auth, userController.register);
router.post('/login', validatePassword.auth, userController.login)


module.exports = router