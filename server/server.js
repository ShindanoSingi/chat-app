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
        origin: 'http://localhost:3008',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
});

// Check the connection f socket from client
io.on('connection', (socket) => {
    // socket events will be here
    socket.on('join-room', (userId) => {
        console.log('User joined the room: ', userId);
        socket.join(userId);
    });
    socket.on('send-message', ({ text, sender, receipient }) => {
        socket.to(receipient).emit('receive-message', {
            text,
            sender,
            receipient,
        });
    });
});

app.use('/api/users', usersRoute);
app.use('/api/chats', chatsRoute);
app.use('/api/messages', messagesRoute);

server.listen(PORT, () => console.log(`App is running on port ${PORT}.`));
