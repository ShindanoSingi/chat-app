const User = require('../models/userModel');
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');
const { response } = require('express');
const cloudinary = require('../cloudinary');

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
          return res.send({
               message: 'User has been created.',
               success: true,
          });
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
                    message: 'Invalid e-mail',
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
          const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
          res.send({
               success: true,
               message: `User Logged in successfully!`,
               data: token,
          });
     } catch (error) {
          res.send({
               message: error.message,
               success: false,
          });
     }
});

// Get current user
router.get('/get-current-user', authMiddleware, async (req, res) => {
     try {
          const user = await User.findOne({ _id: req.body.userId });
          res.send({
               success: true,
               message: 'User fetched successfully!',
               data: user,
          });
     } catch (error) {
          res.send({
               message: error.message,
               success: false,
          });
     }
});

// Get all users except current user
router.get('/get-all-users', authMiddleware, async (req, res) => {
     try {
          const allUsers = await User.find({ _id: { $ne: req.body.userId } });
          res.send({
               success: true,
               message: 'Users fetched successfully!',
               data: allUsers,
          });
     } catch (error) {
          res.send({
               message: error.message,
               success: false,
          });
     }
});

// Update user profile picture
router.post('/update-profile-picture', authMiddleware, async (req, res) => {
     try {
          const image = req.body.image;

          // Upload image to cloudinary and get the url
          const uploadedImage = await cloudinary.uploader.upload(image, {
               folder: 'assets',
          });

          // Update user profile picture
          const user = await User.findOneAndUpdate(
               { _id: req.body.userId },
               { profilePic: uploadedImage.secure_url },
               { new: true }
          );

          res.send({
               success: true,
               message: 'Profile picture updated successfully!',
               data: user,
          });

     } catch (error) {
          res.send({
               message: error.message,
               success: false,
          });
     }
});


module.exports = router;