const express = require('express');
require('dotenv').config();
const app = express();
const dbConfig = require('./config/dbconfig');
const PORT = process.env.PORT || 5000;

// Connect to the database
const usersRoute = require('./routes/usersRoutes');
const chatsRoute = require('./routes/chatsRoutes');

app.use(express.json());

app.use('/api/users', usersRoute);
app.use('/api/chats', chatsRoute);

app.listen(PORT, () => console.log(`App is running on port ${PORT}.`));
