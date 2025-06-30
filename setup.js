const fs = require('fs');
const path = require('path');

console.log('🚀 Configurando Todo Tasks...\n');

// Crear archivo .env si no existe
const envPath = path.join(__dirname, '.env');
const envContent = `# Configuración del servidor
PORT=3000

# JWT Secret (cambia esto por una cadena segura en producción)
JWT_SECRET=mi_secreto_jwt_super_seguro_para_todo_tasks_2024

# Configuración de CORS
CORS_ORIGIN=http://localhost:5173

# Configuración de la base de datos (si usas una)
# DATABASE_URL=mongodb://localhost:27017/todotasks
`;

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Archivo .env creado');
} else {
  console.log('ℹ️  Archivo .env ya existe');
}

// Verificar que existan los archivos de base de datos
const usersPath = path.join(__dirname, 'backend/src/database/users.json');
const tasksPath = path.join(__dirname, 'backend/src/database/tasks.json');

if (!fs.existsSync(usersPath)) {
  fs.writeFileSync(usersPath, JSON.stringify([], null, 2));
  console.log('✅ Archivo users.json creado');
}

if (!fs.existsSync(tasksPath)) {
  fs.writeFileSync(tasksPath, JSON.stringify([], null, 2));
  console.log('✅ Archivo tasks.json creado');
}

console.log('\n🎉 Configuración completada!');
console.log('\n📋 Próximos pasos:');
console.log('1. Instalar dependencias: npm install');
console.log('2. Instalar dependencias del frontend: cd frontend && npm install');
console.log('3. Iniciar el servidor: npm start');
console.log('4. En otra terminal, iniciar el frontend: cd frontend && npm run dev');
console.log('\n🌐 La aplicación estará disponible en:');
console.log('- Frontend: http://localhost:5173');
console.log('- Backend: http://localhost:3000'); 