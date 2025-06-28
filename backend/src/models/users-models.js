const fs = require('fs');
const path = require('path');
const userPath = path.join(__dirname, '../database/users.json');

function getUsers() {
    return JSON.parse(fs.readFileSync(userPath))
}

function saveUser (user){
    fs.writeFileSync(userPath, JSON.stringify(user, null, 2))
}

function getUserByEmail(email) {
    const users = getUsers();
    return users.find(u => u.email === email)
}

function addUser(user) {
    const users = getUsers();
    const newUser = { id: Date.now(), ...user };
    users.push(newUser)
    saveUser(users);
    return newUser
}   

module.exports = {getUserByEmail, addUser}
