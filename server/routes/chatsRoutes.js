const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const chats = require('../models/chatModel');
const messages = require('../models/messageModel');


// Create a new chat
router.post('/create-new-chat', authMiddleware, async (req, res) => {
     try {
          const newChat = new chats(req.body);
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
          })
               .populate('members')
               .populate('lastMessage')
               .sort({ updatedAt: -1 });


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

// Clear all unread messages of a chat
router.post('/clear-unread-messages', authMiddleware, async (req, res) => {
     try {

          // find chat and update unread messages count to 0 
          const chat = await chats.findById(req.body.chat);
          if (!chat) {
               return res.send({
                    success: false,
                    message: 'Chat not found',
               });
          }
          const updatedChat = await chats.findByIdAndUpdate(
               req.body.chat,
               {
                    unreadMessages: 0,
               },
               { new: true }
          ).populate('members').populate('lastMessage');

          // find all unread messages of the chat and update them to read
          await messages.updateMany(
               {
                    chat: req.body.chat,
                    read: false,
               },
               {
                    read: true,
               }
          );

          res.send({
               success: true,
               message: 'Unread messages cleared successfully',
               data: updatedChat,
          });
     } catch (error) {
          res.send({
               success: false,
               message: 'Error clearing unread messages',
               error: error.message,
          });
     }
});

module.exports = router;