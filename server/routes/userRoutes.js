const User = require('../models/userModel');
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User registration
router.post('/register', async (req, res) => {
     try {
          // Check if the user is already registered
          const user = await User.findOne({ email: req.body.email });

          if (user) {
               return res.send({
                    message: 'User already exists',
                    success: false,
               });
          }
          // Create a new user
          const hashedPassword = await bcrypt.hash(req.body.password, 10);
          req.body.password = hashedPassword;
          const newUser = new User(req.body);
          await newUser.save();
          res.json({ message: `User has been created.` });
     } catch (error) {
          res.send({
               message: error.message,
               success: false
          });
     }
});

// User login
router.post('/login', async (req, res) => {
     try {
          // Check if the user is already existing
          const user = await User.findOne({ email: req.body.email });
          if (!user) {
               return res.send({
                    success: false,
                    message: 'User does not exist',
               });
          }
          // Check if the password is correct
          const validPassword = await bcrypt.compare(req.body.password, user.password);
          if (!validPassword) {
               return res.send({
                    success: false,
                    message: 'Invalid password',
               });
          }

          // Create and assign a token
          const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
          res.json({
               message: `User has been logged in.`
          });
     } catch (error) {
          res.send({
               message: error.message,
               success: false,
          });
     }
});

module.exports = router;