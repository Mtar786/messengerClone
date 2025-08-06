const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

const authRoute = require('./routes/auth');
const conversationRoute = require('./routes/conversations');
const messageRoute = require('./routes/messages');
const userRoute = require('./routes/users');

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to DB'))
  .catch((err) => console.log(err));

// Define API routes
app.use('/api/auth', authRoute);
app.use('/api/conversations', conversationRoute);
app.use('/api/messages', messageRoute);
app.use('/api/users', userRoute);

// Create HTTP server and attach Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

/**
 * In-memory store of connected users.
 * Each entry is of the form { userId, socketId }.
 */
let users = [];

const addUser = (userId, socketId) => {
  // Only add if user is not already present
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};
const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

/**
 * Socket.io connection handler.
 * Handles adding users, sending messages and disconnections【444182637821624†L190-L218】.
 */
io.on('connection', (socket) => {
  console.log('a user connected');

  // Listen for user addition
  socket.on('addUser', (userId) => {
    addUser(userId, socket.id);
    // Send the updated list of online users to all clients
    io.emit('getUsers', users);
  });

  // Listen for incoming messages and forward to receiver if connected
  socket.on('sendMessage', ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    if (user) {
      io.to(user.socketId).emit('getMessage', {
        senderId,
        text,
      });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('a user disconnected');
    removeUser(socket.id);
    io.emit('getUsers', users);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});