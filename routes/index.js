const express = require("express");
const { loginCheck } = require("./middlewares");
const router = express.Router();
const axios = require("axios");
const User = require("../models/User");
const Activity = require("../models/Activity");
/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("auth/signup");
});

module.exports = router;
