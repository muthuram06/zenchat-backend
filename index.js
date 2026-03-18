const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const socket = require('socket.io');
require('dotenv').config();

const app = express();
const port = process.env.PORT;
const DB_URL = process.env.DB_URL;

// Middleware for CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// Middleware for CORS
app.use(cors());

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// socket.io integration
const io = socket(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@testing
// const io =  socket(server, {
//     cors: {
//         origin: 'http://localhost:3000',
//         methods: ['GET', 'POST'],
//     },
// });

global.onlineUsers = new Map();

io.on('connection', (socket) => {
    global.chatSocket = socket;

    socket.on('add-user', (userId) => {
        onlineUsers.set(userId, socket.id);
    });
    socket.on("send-msg", async (data) => {
        const sendUserSocket = await onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit('msg-recieve', data.message);
        }
    });
});

// Database connection
mongoose.connect(DB_URL).then(() => {
    console.log('Successfully connected to the database');
});

// Express middlewares
app.use(express.json({ limit: '10mb' }));
app.use('/auth', require('./Router/authRouter'));
app.use('/users', require('./Router/userRouter'));
app.use('/messages', require('./Router/messageRouter'));
