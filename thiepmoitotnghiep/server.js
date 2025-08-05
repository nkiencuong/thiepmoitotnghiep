// Simple Node.js server to handle message form
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { readDatabase, writeDatabase } = require('./connect');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

app.post('/api/message', (req, res) => {
  const { name, message } = req.body;
  if (!name || !message) {
    return res.json({ success: false, error: 'Missing fields' });
  }
  const db = readDatabase() || { messages: [] };
  db.messages = db.messages || [];
  db.messages.push({ name, message, time: new Date().toISOString() });
  const ok = writeDatabase(db);
  res.json({ success: ok });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
