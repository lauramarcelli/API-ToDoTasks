const express = require ('express');
const cors = require ('cors');
const bodyParser = require ('body-parser');
const path = require ('path');
const tasksRoutes = require ('.routes/task-routes');
import { errorMiddleware } from './middlewares/error-middleware.js';

const app = express();
const PORT = 3000;

//Middleware
app.use(cors());
app.use(bodyParser.json());

//Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

//Rutas API
app.use('api/tasks', tasksRoutes);

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