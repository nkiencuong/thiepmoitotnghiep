// API route for Render/Vercel/Netlify serverless
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'thiepmoi.thiepmoitotnghiep.json');

function getMessages() {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function addMessage(name, message) {
  let messages = getMessages();
  messages.push({ name, message, time: new Date().toISOString() });
  fs.writeFileSync(dbPath, JSON.stringify(messages, null, 2), 'utf8');
}

module.exports = { getMessages, addMessage };
