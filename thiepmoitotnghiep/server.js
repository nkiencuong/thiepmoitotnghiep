// Simple Node.js server to handle message form
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const Message = require('./models/Message');


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Kết nối MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/thiepmoi';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Đã kết nối MongoDB'))
  .catch(err => console.error('Lỗi kết nối MongoDB:', err));

app.post('/api/message', async (req, res) => {
  const { name, message } = req.body;
  if (!name || !message) {
    return res.json({ success: false, error: 'Missing fields' });
  }
  try {
    const newMsg = new Message({ name, message });
    await newMsg.save();
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
