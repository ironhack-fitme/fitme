const express = require('express');
const {
  loginCheck
} = require('./middlewares');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User')
router.get('/user/:_id', loginCheck(), (req, res) => {
  const userId = req.user;
  console.log(userId)
  User.findById(userId).then(userFromDataBase => {
    console.log(userFromDataBase);
    res.render('user/profile', {
      user: userFromDataBase
    });
  }).catch(err => {
    console.log(err);
  });
});












module.exports = router;