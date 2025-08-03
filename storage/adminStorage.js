const fs = require('fs'); // Handles file system operations
const path = require('path'); // Resolves file paths

const DB = path.join(__dirname, '../adminusers.json');// Absolute path to the JSON file

// Read function
function readData() {
  try {
    const datos = fs.readFileSync(DB, 'utf8');
    return JSON.parse(datos || '[]');
  } catch (err) {
    console.error('Error al leer adminusers.json:', err);
    return [];
  }
}

// Write fuction
function writeData(datos) {
  try {
    fs.writeFileSync(DB, JSON.stringify(datos, null, 2), 'utf8');
  } catch (err) {
    console.error('Error al escribir adminusers.json:', err);
  }
}

module.exports = {
  // Adds a new user to the JSON file
  add: (user) => {
    const users = readData();
    users.push(user);
    writeData(users);
    return user;
  },
  // Finds a user by email
  findByEmail: (email) => {
    const users = readData();
    return users.find(u => u.email === email);
  },
  // Validates login credentials (email and password)
  validateLogin: (email, password) => {
    const users = readData();
    return users.find(u => u.email === email && u.password === password) || null;
  },
  // Retrieves all users
  getAll: () => readData()
};
