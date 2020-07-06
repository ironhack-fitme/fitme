const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();
const User = require('../models/User');
const passport = require('passport');

router.get('/fitbit',
  passport.authenticate('fitbit', { scope: ['activity','heartrate','location','profile'] }

));

router.get('/fitbit/callback', passport.authenticate( 'fitbit', { 
        successRedirect: '/activities',
        failureRedirect: '/auth/login'
}));


router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});


router.get('/logout', (req, res, next) => {
  // passport
  console.log(req);
  req.logout();
  res.redirect('/');
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/activities',
    failureRedirect: '/auth/login',
    failureFlash: true,
    passReqToCallback: true
  })
)

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  if (password.length < 8) {
    res.render('auth/signup', {
      message: 'Your password must be 8 characters minimun.'
    });
    return;
  }
  if (username === '') {
    res.render('auth/signup', { message: 'Your username cannot be empty' });
    return;
  }

  User.findOne({ username: username }).then(found => {
    if (found !== null) {
      res.render('auth/signup', { message: 'Wrong credentials' });
    } else {
      // we can create a user with the username and password pair
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);

      User.create({ username: username, password: hash })
        .then(dbUser => {
          // passport - login the user
          req.login(dbUser, err => {
            if (err) next(err);
            else res.redirect('/index/activities');
          });

          // redirect to login
          res.redirect('login');
        })
        .catch(err => {
          next(err);
        });
    }
  });
});

module.exports = router;