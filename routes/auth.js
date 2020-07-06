const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();
const User = require('../models/User');
const passport = require('passport');

router.get('/fitbit',
  passport.authenticate('fitbit', { scope: ['activity','heartrate','location','profile'] }

));

router.get('/fitbit/callback', passport.authenticate( 'fitbit', { 
        successRedirect: '/',
        failureRedirect: '/auth/login'
}));


router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true,
    passReqToCallback: true
  })
)

module.exports = router;