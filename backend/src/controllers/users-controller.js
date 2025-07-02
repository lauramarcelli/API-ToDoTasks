const User = require('../models/users-models.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//Registrar un nuevo usuario
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        
        // Validaciones
        if(!email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Los campos email y password son requeridos' 
            });
        }

        if(password.length < 6) {
            return res.status(400).json({ 
                success: false,
                message: 'La contraseña debe tener al menos 6 caracteres' 
            });
        }

        // Verificar si el usuario ya existe
        const existingUser = User.getUserByEmail(email);
        if(existingUser) {
            return res.status(409).json({ 
                success: false,
                message: 'El usuario ya existe'
            });
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Crear nuevo usuario
        const newUser = User.addUser({ 
            name: name || 'Usuario', 
            email, 
            password: hashedPassword 
        });

        // Generar token para el nuevo usuario
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        // No enviar la contraseña en la respuesta
        const { password: _, ...userWithoutPassword } = newUser;

        console.log('Usuario registrado exitosamente:', newUser.email);

        res.status(201).json({ 
            success: true,
            message: 'Usuario registrado exitosamente', 
            token,
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ 
            success: false,
            message: error.message || 'Error interno del servidor' 
        });
    }
};

//Iniciar sesión
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validaciones
        if(!email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Email y password son requeridos' 
            });
        }
        
        // Buscar usuario
        const user = User.getUserByEmail(email); 
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Usuario no encontrado' 
            });
        }

        // Verificar contraseña
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ 
                success: false,
                message: 'Contraseña incorrecta' 
            });
        }
        
        // Generar token
        const token = jwt.sign(
            
            { id: user.id, email: user.email }, 
            
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        // No enviar la contraseña en la respuesta
        const { password: _, ...userWithoutPassword } = user;

        console.log('Usuario logueado exitosamente:', user.email);

        res.json({ 
            success: true,
            message: 'Usuario logueado exitosamente', 
            token,
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error interno del servidor' 
        });
    }
};


