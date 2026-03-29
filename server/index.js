const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./db');
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: 'https://ai-code-sandbox.vercel.app',
    methods: ['GET', 'POST']
  }
});

app.use(cors({ origin: 'https://ai-code-sandbox.vercel.app' }));
app.use(express.json());

const aiRoutes = require('./routes/ai');
const codeRoutes = require('./routes/code');
const snippetRoutes = require('./routes/snippets');
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
app.use('/api/snippets', snippetRoutes);

app.use('/api/ai', aiRoutes);
app.use('/api/code', codeRoutes);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});