const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const chats = require('../models/chatModel');


// Create a new chat
router.post('/create-new-chat', authMiddleware, async (req, res) => {
     try {
          const newChat = new chats(req.params);
          const savedChat = await newChat.save();
          res.send({
               success: true,
               message: 'Chat created successfully',
               data: savedChat,
          });
     } catch (error) {
          res.send({
               success: false,
               message: 'Error creating chat',
               error: error.message,
          });
     }
});

// Get all chats of current user
router.get('/get-all-chats', authMiddleware, async (req, res) => {
     try {
          const allChats = await chats.find({
               members: {
                    $in: [req.body.userId],
               },
          });
          res.send({
               success: true,
               message: 'All chats retrieved successfully',
               data: allChats,
          });
     } catch (error) {
          res.send({
               success: false,
               message: 'Error retrieving chats',
               error: error.message,
          });
     }
});

module.exports = router;