const User = require('../models/users-models.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//Registrar un nuevo usuario
exports.registerUser = async (req, res) => {
    const { email, password } = req.body
    if(!email || !password) {
        return res.status(400).json({ error: 'Los campos no pueden estar vacíos' });
    }

    if(User.getUserByEmail(email)) {
        return res.status(409).json({ error: 'El usuario ya existe'});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = User.addUser({ id: Date.now(), email, password: hashedPassword })
    res.status(201).json({ message: 'Usuario registrado exitosamente', user: newUser})
}

//Iniciar sesión
exports.loginUser = async (req, res) => {
    const { email, password } = req.body
    
    const user = User.getUserByEmail(email); 
    if (!user || !bcrypt.compare(password, user.password)) {
        return res.status(401).json({ error: 'El usuario no existe o la contraseña es incorrecta' });
    }

    const token = jwt.sign({ id: user.id, email: user.email}, process.env.JWT_SECRET, { expiresIn: '1h'})

    res.json({ message: 'Usuario logueado exitosamente', token})
}


