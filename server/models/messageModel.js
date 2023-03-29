const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
     chat: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Chats'
     },
     sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
     },
     test: {
          type: String,
          required: true,
     },
     read: {
          type: Boolean,
          default: false,
     },
},
     {
          timestamps: true,
     }
);

module.exports = mongoose.model('messages', messageSchema);