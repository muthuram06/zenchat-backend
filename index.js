const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const socket = require('socket.io');
require('dotenv').config();

const app = express();

// ✅ Fix PORT (Render requires this)
const port = process.env.PORT || 5000;

// ✅ Environment variable for DB
const DB_URL = process.env.DB_URL;

// ✅ Middleware (CORS FIXED for production)
app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://zenchat-frontend.vercel.app"
],
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// ✅ Start server
const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// ✅ Socket.io setup
const io = socket(server, {
    cors: {
        origin: "*", // allow all for now (safe alternative)
        methods: ['GET', 'POST'],
    },
});

global.onlineUsers = new Map();

io.on('connection', (socket) => {
    global.chatSocket = socket;

    socket.on('add-user', (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", async (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit('msg-recieve', data.message);
        }
    });
});

// ✅ Database connection (FIXED ERROR HANDLING)
if (!DB_URL) {
    console.error("❌ DB_URL is missing. Please add it in Render Environment Variables.");
    process.exit(1);
}

mongoose.connect(DB_URL)
    .then(() => {
        console.log('✅ Successfully connected to the database');
    })
    .catch((err) => {
        console.error('❌ DB connection error:', err);
    });

// ✅ Routes
app.use('/auth', require('./Router/authRouter'));
app.use('/users', require('./Router/userRouter'));
app.use('/messages', require('./Router/messageRouter'));