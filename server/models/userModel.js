const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
     name: {
          type: String,
          required: true,
     },
     email: {
          type: String,
          Unique: true,
          required: true,
     },
     password: {
          type: String,
          required: true,
     },
     profilePic: {
          type: String,
          required: false,
     }
},
     {
          timestamps: true,
     }
)
module.exports = mongoose.model('users', userSchema);