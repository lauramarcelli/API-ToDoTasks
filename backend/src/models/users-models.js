const fs = require('fs');
const path = require('path');
const userPath = path.join(__dirname, '../database/users.json');

function getUsers() {
    try {
        if (!fs.existsSync(userPath)) {
            // Si el archivo no existe, crear uno vacío
            fs.writeFileSync(userPath, JSON.stringify([], null, 2));
            return [];
        }
        const data = fs.readFileSync(userPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error leyendo usuarios:', error);
        // Si hay error, crear un archivo nuevo
        fs.writeFileSync(userPath, JSON.stringify([], null, 2));
        return [];
    }
}

// Función para obtener el siguiente ID disponible
function getNextUserId() {
    const users = getUsers();
    if (users.length === 0) {
        return 1;
    }
    const maxId = Math.max(...users.map(user => user.id));
    return maxId + 1;
}

function saveUser(users) {
    try {
        // Asegurar que el directorio existe
        const dir = path.dirname(userPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(userPath, JSON.stringify(users, null, 2));
        console.log('Usuarios guardados exitosamente');
    } catch (error) {
        console.error('Error guardando usuarios:', error);
        throw error;
    }
}

function getUserByEmail(email) {
    const users = getUsers();
    return users.find(u => u.email === email);
}

function getUserById(id) {
    const users = getUsers();
    return users.find(u => u.id === id);
}

function addUser(user) {
    const users = getUsers();
    
    // Verificar si el usuario ya existe
    if (users.find(u => u.email === user.email)) {
        throw new Error('El usuario ya existe');
    }
    
    const newUser = { 
        id: getNextUserId(), // Usar contador incremental
        name: user.name || 'Usuario',
        email: user.email,
        password: user.password,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUser(users);
    
    console.log('Nuevo usuario agregado:', { id: newUser.id, email: newUser.email, name: newUser.name });
    return newUser;
}   

module.exports = {getUserByEmail, getUserById, addUser}
