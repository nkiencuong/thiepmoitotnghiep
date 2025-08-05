// Kết nối tới file database JSON
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'thiepmoi.thiepmoitotnghiep.json');

function readDatabase() {
    try {
        const data = fs.readFileSync(dbPath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Không thể đọc database:', err);
        return null;
    }
}

function writeDatabase(newData) {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(newData, null, 2), 'utf8');
        return true;
    } catch (err) {
        console.error('Không thể ghi database:', err);
        return false;
    }
}

module.exports = { readDatabase, writeDatabase };
