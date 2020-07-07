const express = require('express');
const { loginCheck } = require('./middlewares');
const router  = express.Router();
const axios = require('axios');


/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;