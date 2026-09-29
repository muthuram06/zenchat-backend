const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const socket = require('socket.io');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL;

// Middleware
app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://zenchat-frontend.vercel.app"
    ],
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/auth', require('./Router/authRouter'));
app.use('/users', require('./Router/userRouter'));
app.use('/messages', require('./Router/messageRouter'));

// Start server only after MongoDB connects
const startServer = async () => {
    if (!DB_URL) {
        console.error("❌ DB_URL is missing.");
        process.exit(1);
    }

    try {
        await mongoose.connect(DB_URL);

        console.log('✅ Successfully connected to the database');

        const server = app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });

        // Socket.io
        const io = socket(server, {
            cors: {
                origin: "*",
                methods: ['GET', 'POST'],
            },
        });

        global.onlineUsers = new Map();

        io.on('connection', (socket) => {
            global.chatSocket = socket;

            socket.on('add-user', (userId) => {
                onlineUsers.set(userId, socket.id);
            });

            socket.on('send-msg', async (data) => {
                const sendUserSocket = onlineUsers.get(data.to);

                if (sendUserSocket) {
                    socket.to(sendUserSocket).emit(
                        'msg-recieve',
                        data.message
                    );
                }
            });
        });

    } catch (err) {
        console.error('❌ DB connection error:', err);
        process.exit(1);
    }
};

startServer();