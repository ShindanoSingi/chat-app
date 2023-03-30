const router = require("express").Router();
const chat = require("../models/chatModel");
const message = require("../models/messageModel");
const authMiddleware = require("../middlewares/authMiddleware");

// new message
router.post("/new-message", authMiddleware, async (req, res) => {
     try {
          // Store message
          const newMessage = new message(req.body);
          const savedMessage = await newMessage.save();

          // update last message of chat
          await chat.findOneAndUpdate(
               { _id: req.body.cha },
               {
                    lastMessage: savedMessage._id,
                    unread: {
                         $inc: 1,
                    }
               });
          res.send({
               message: "Message sent successfully",
               success: true,
               data: savedMessage,
          });
     } catch (error) {
          res.send({
               message: "Message sent successfully",
               success: true,
               data: savedMessage,
          });
     }
});

// get all messages of a chat
router.get("/get-all-messages/:chatId", authMiddleware, async (req, res) => {
     try {
          const messages = await message.find({
               chat: req.params.chatId,
          }).sort({ createdAt: 1 });
          res.send({
               message: "Messages fetched successfully",
               success: true,
               data: messages,
          });
     } catch (error) {
          res.send({
               success: false,
               message: "Messages fetched successfully",
               error: error.message,
          });
     }
});

module.exports = router;