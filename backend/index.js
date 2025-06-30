const express = require ('express');
const cors = require ('cors');
const dotenv = require('dotenv')
const bodyParser = require ('body-parser');
const path = require ('path');
const tasksRoutes = require ('./src/routes/tasks-routes');
const userRoutes = require ('./src/routes/users-routes');
const errorMiddleware = require ('./src/middlewares/error-middleware');
const authMiddleware = require ('./src/middlewares/auth-middleware');

dotenv.config()
const app = express();
app.use(express.json());

const PORT = 3000
require('dotenv').config()

// Configuración de CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

//Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Log de peticiones para debug
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Headers:`, req.headers)
  next()
})

//Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

//Rutas API
app.use('/api/user', userRoutes);
app.use('/api/tasks', authMiddleware, tasksRoutes);
app.use(errorMiddleware);

app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
})



//Ruta para manejar cualquier otra solicitud
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/App.jsx'));
})

//Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`CORS configurado para: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
})