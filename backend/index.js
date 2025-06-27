const express = require ('express');
const cors = require ('cors');
const dotenv = require('dotenv')
const fs = require('fs');
const bodyParser = require ('body-parser');
const path = require ('path');
const tasksRoutes = require ('.routes/task-routes');
const userRoutes = require ('.routes/user-routes');
import { errorMiddleware } from './middlewares/error-middleware.js';

const app = express();
const PORT = 3000
require('dotenv').config()
const SECRET_KEY = process.env.SECRET_KEY 

//Middleware
app.use(cors());
app.use(bodyParser.json());

//Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

//Rutas API
app.use('/api/tasks', tasksRoutes);
app.use('/api/user', userRoutes);

app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
})

app.use(errorMiddleware);

//Ruta para manejar cualquier otra solicitud
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/App.jsx'));
})

//Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
})