const fs = require('fs'); // Handles file system operations
const path = require('path'); // Resolves file paths

// Absolute path to the JSON file
const DB = path.join(__dirname, '../requests.json');

// Read Function
function readData() {
  try {
    const datos = fs.readFileSync(DB, 'utf8');
    return JSON.parse(datos || '[]');
  } catch (err) {
    console.error('Error no esta leyendo las requests.json:', err);
    return [];
  }
}

//  Write Function
function writeData(datos) {
  try {
    fs.writeFileSync(DB, JSON.stringify(datos, null, 2), 'utf8');
  } catch (err) {
    console.error('Error al escrbir las requests.json:', err);
  }
}

//  Retrieve a single request by ID
function get(id) {
  const data = readData();
  return data.find(item => item.id === id);
}

module.exports = {
  // Retrieves all requests
  getAll: () => readData(),

  // Retrieves a specific request by ID
  get,

  // Adds a new request to the JSON file
  add: (newob) => {
    const cont = readData();
    cont.push(newob);
    writeData(cont);
    return newob;
  },
  
  // Updates an existing request by ID
  update: (id, actual) => {
    const cont = readData();
    const ids = cont.findIndex(r => r.id === id);
    if (ids === -1) return null;
    cont[ids] = { ...cont[ids], ...actual, updatedAt: new Date().toISOString() };
    writeData(cont);
    return cont[ids];
  }
};
