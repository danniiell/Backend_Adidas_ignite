const fs = require('fs');
const path = require('path');

// Apunta al requests.json en la raíz de backend
const DB = path.join(__dirname, '../requests.json');

function readData() {
  try {
    const datos = fs.readFileSync(DB, 'utf8');
    return JSON.parse(datos || '[]');
  } catch (err) {
    console.error('Error no esta leyendo las requests.json:', err);
    return [];
  }
}

function writeData(datos) {
  try {
    fs.writeFileSync(DB, JSON.stringify(datos, null, 2), 'utf8');
  } catch (err) {
    console.error('Error al escrbir las requests.json:', err);
  }
}

module.exports = {
  getAll: () => readData(),

  add: (newob) => {
    const cont = readData();
    cont.push(newob);
    writeData(cont);
    return newob;
  },

  update: (id, actual) => {
    const cont = readData();
    const ids = cont.findIndex(r => r.id === id);
    if (ids === -1) return null;
    cont[ids] = { ...cont[ids], ...actual, updatedAt: new Date().toISOString() };
    writeData(cont);
    return cont[ids];
  }
};
