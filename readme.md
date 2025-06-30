# Todo Tasks - Panel de Tareas

Es una aplicación web moderna para gestionar tareas con un diseño tipo Trello, que incluye autenticación de usuarios y funcionalidad de drag and drop.

## 🚀 Características

- **Autenticación de usuarios**: Sistema de login y registro
- **Panel tipo Trello**: Organización de tareas en columnas (Por Hacer, En Progreso, Completado)
- **Drag and Drop**: Mover tareas entre columnas arrastrándolas
- **Gestión de tareas**: Crear, editar, eliminar y marcar tareas como completadas
- **Diseño responsive**: Funciona perfectamente en dispositivos móviles y desktop
- **Interfaz moderna**: Diseño limpio y profesional con animaciones suaves

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** con Express
- **JWT** para autenticación
- **bcrypt** para encriptación de contraseñas
- **CORS** para comunicación entre frontend y backend

### Frontend
- **React 18** con hooks
- **Vite** como bundler
- **React Router** para navegación
- **React Beautiful DnD** para drag and drop
- **Axios** para llamadas a la API
- **CSS moderno** con variables CSS y diseño responsive

## 📦 Instalación

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd API-ToDoTasks
   ```

2. **Instalar dependencias del backend**
   ```bash
   npm install
   ```

3. **Instalar dependencias del frontend**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Configurar variables de entorno**
   Crear un archivo `.env` en la raíz del proyecto:
   ```env
   # Configuración del servidor
   PORT=3000
   # Configuración de CORS
   CORS_ORIGIN=http://localhost:5173
   # Configuración del JWT
   JWT_SECRET=mi_secreto_jwt_super_seguro_para_todo_tasks_2024
   ```

## 🚀 Ejecución

### Desarrollo

1. **Iniciar el backend**
   ```bash
   # Desde la raíz del proyecto
   npm start
   ```
   El servidor se ejecutará en `http://localhost:3000`

2. **Iniciar el frontend**
   ```bash
   # Desde el directorio frontend
   cd frontend
   npm run dev
   ```
   La aplicación se ejecutará en `http://localhost:5173`

### Desarrollo con ambos servidores
```bash
# Desde la raíz del proyecto
npm run dev
```

### Producción

1. **Construir el frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Iniciar el servidor de producción**
   ```bash
   # Desde la raíz del proyecto
   npm start
   ```

## 📱 Uso de la Aplicación

### Registro e Inicio de Sesión
1. Accede a la aplicación en tu navegador
2. Si no tienes cuenta, haz clic en "Regístrate aquí"
3. Completa el formulario de registro con:
   - **Nombre**: Tu nombre completo
   - **Email**: Tu dirección de email
   - **Contraseña**: Una contraseña segura
4. Si ya tienes cuenta, inicia sesión con tu email y contraseña

### Gestión de Tareas
1. **Crear una tarea**: Haz clic en el botón "+ Nueva Tarea"
2. **Editar una tarea**: Haz clic en "Editar" en cualquier tarea
3. **Eliminar una tarea**: Haz clic en "Eliminar" en cualquier tarea
4. **Mover tareas**: Arrastra y suelta las tareas entre las columnas

### Columnas del Panel
- **Por Hacer**: Tareas pendientes
- **En Progreso**: Tareas en desarrollo
- **Completado**: Tareas finalizadas

## 🔧 Estructura del Proyecto

```
API-ToDoTasks/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── database/
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .env
└── README.md
```

## 🌟 Características Destacadas

### Diseño Moderno
- Gradientes y sombras suaves
- Animaciones fluidas
- Tipografía Inter para mejor legibilidad
- Paleta de colores profesional

### Experiencia de Usuario
- Interfaz intuitiva tipo Trello
- Feedback visual en tiempo real
- Carga optimizada
- Manejo de errores amigable

### Funcionalidad Avanzada
- Drag and drop nativo
- Persistencia de datos
- Autenticación segura
- Responsive design

## 🐛 Solución de Problemas

### Error de CORS
Si tienes problemas de CORS, asegúrate de que:
1. El archivo `.env` tenga la configuración correcta de `CORS_ORIGIN`
2. El frontend esté corriendo en el puerto 5173
3. El backend esté corriendo en el puerto 3000

### Error de Base de Datos
Si tienes problemas con la persistencia de datos:
1. Verifica que los archivos JSON en `backend/src/database/` tengan permisos de escritura
2. Los datos se almacenan localmente en archivos JSON



## 👨‍💻 Autor

Desarrollado como parte del proyecto de API ToDo Tasks.

---Laura Marcelli, Pamela Fumagalli

¡Disfruta organizando tus tareas de manera eficiente! 🎉
