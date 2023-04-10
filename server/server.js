const express = require('express');
require('dotenv').config();
const app = express();
const dbConfig = require('./config/dbconfig');
const PORT = process.env.PORT || 5000;

// Connect to the database
const usersRoute = require('./routes/usersRoutes');
const chatsRoute = require('./routes/chatsRoutes');
const messagesRoute = require('./routes/messagesRoutes');

app.use(express.json());

const server = require('http').createServer(app);

const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3009',
        methods: ['GET', 'POST'],
    },
});

// Check the connection f socket from client
io.on('connection', (socket) => {
    // socket events will be here
    socket.on('join-room', (userId) => {
        socket.join(userId);
    });
    // Send message to clients (who are present in members array)
    socket.on('send-message', (message) => {
        io.to(message.members[0])
            .to(message.members[1])
            .emit('receive-message', message);
    });
    // Clear unread messages
    socket.on('clear-unread-messages', (data) => {
        io.to(data.members[0])
            .to(data.members[1])
            .emit('unread-messages-cleared', data);
    });

    // Typing event
    socket.on('typing', (data) => {
        io.to(data.members[0])
            .to(data.members[1])
            .emit('typing', data);
    });
});

app.use('/api/users', usersRoute);
app.use('/api/chats', chatsRoute);
app.use('/api/messages', messagesRoute);

server.listen(PORT, () => console.log(`App is running on port ${PORT}.`));
