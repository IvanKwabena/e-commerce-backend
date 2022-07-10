const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

router = express.Router();


// Get list of all Users
router.get('/', async (req, res) => {
  const user = await User.find().select('-passwordHash');

  if (!user) {
    res.status(500).json({ success: false });
  }

  res.send(user);
});

// Get list of a single User
router.get('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send('Invalid Url passed to get all Users');
  }

  const user = await User.findById(req.params.id).select('-passwordHash');
  if (!user) {
    res.status(500).json({ success: false });
  }
  res.send(user);
});

// Post a User(for admins)
router.post('/', async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });
  user = await user.save();

  if (!user) return res.status(400).send('the user cannot be created!');

  res.send(user);
});

// Register a User
router.post('/register', async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });
  user = await user.save();

  if (!user) return res.status(400).send('the user cannot be created!');

  res.send(user);
});

// Login a User
router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).send('User email not found');
  }

  
  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const secret = process.env.API_ACCESS_TOKEN;
    const token = jwt.sign(
      {
        userId: user.id, // this is the field we are serializing for the user
        isAdmin: user.isAdmin,
      },
      secret
      // { expiresIn: '1d' }
    );
    res.status(200).send({ email: user.email, access_token: token });
  } else {
    res.status(400).send('Password Incorrect');
  }
 
});

// Count Users
router.get('/get/count', async (req, res) => {
  const userCount = await User.countDocuments();

  if (!userCount) {
    return res.status(400).send('Cannot get the count of Users');
  }
  res.status(200).send({ userCount });
});

// Delete a User
router.delete('/:id', async (req, res) => {
  const deleteId = req.params.id;
  if (!mongoose.isValidObjectId(deleteId)) {
    return res.status(400).send('Invalid User Id for deletion');
  }

  const user = await User.findByIdAndDelete(deleteId);
  if (!user) {
    return res.status(401).send('Invalid User to delete');
  }
  res.status(200).send('User Successfully Deleted');
});
module.exports = router;
