const express = require('express');
const { loginCheck } = require('./middlewares');
const router  = express.Router();
const axios = require('axios');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/profile', loginCheck(), (req, res, next) => {
  const user = req.user;
  res.render('user/profile');
});

router.get('/add-activities', loginCheck(), (req, res, next) => {
  console.log(req);
  const user = req.user;
    // call the star wars api and then render the species list from the response into the index view
    axios.get('https://swapi.py4e.com/api/species')
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        console.log(err);
      })
  res.render('user/activities',{user});
});
module.exports = router;
