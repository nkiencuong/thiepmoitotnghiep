// Simple Node.js server to handle message form
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { getMessages, addMessage } = require('./api/message');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

app.post('/api/message', (req, res) => {
  const { name, message } = req.body;
  if (!name || !message) {
    return res.json({ success: false, error: 'Missing fields' });
  }
  try {
    addMessage(name, message);
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
