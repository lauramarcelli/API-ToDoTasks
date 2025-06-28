const express = require ('express');
const cors = require ('cors');
const dotenv = require('dotenv')
const bodyParser = require ('body-parser');
const path = require ('path');
const tasksRoutes = require ('.routes/tasks-routes');
const userRoutes = require ('.routes/users-routes');
const errorMiddleware = require ('./middlewares/error-middleware');
const authMiddleware = require ('./middlewares/auth-middleware');

dotenv.config()
const app = express();

const PORT = 3000
require('dotenv').config()


//Middleware
app.use(cors());
app.use(bodyParser.json());

//Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

//Rutas API
app.use('/api/tasks', tasksRoutes);
app.use('/api/user', authMiddleware, userRoutes);
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
})