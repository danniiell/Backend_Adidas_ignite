const fs = require('fs');
const path = require('path');

const DB = path.join(__dirname, '../adminusers.json');

function readData() {
  try {
    const datos = fs.readFileSync(DB, 'utf8');
    return JSON.parse(datos || '[]');
  } catch (err) {
    console.error('Error al leer adminusers.json:', err);
    return [];
  }
}

function writeData(datos) {
  try {
    fs.writeFileSync(DB, JSON.stringify(datos, null, 2), 'utf8');
  } catch (err) {
    console.error('Error al escribir adminusers.json:', err);
  }
}

module.exports = {
  add: (user) => {
    const users = readData();
    users.push(user);
    writeData(users);
    return user;
  },

  findByEmail: (email) => {
    const users = readData();
    return users.find(u => u.email === email);
  },

  validateLogin: (email, password) => {
    const users = readData();
    return users.find(u => u.email === email && u.password === password) || null;
  },

  getAll: () => readData()
};
