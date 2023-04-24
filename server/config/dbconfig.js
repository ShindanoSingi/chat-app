const mongoose = require('mongoose');

console.log(process.env.CLOUD_NAME);

mongoose.connect(process.env.MONGO_URL)

const db = mongoose.connection;

db.on('connected', () => {
     console.log(`Mongo DB Connection Successful!`);
})

db.on('error', (err) => {
     console.log(`Mongo DB Connection Failed!`);
})

module.exports = db;