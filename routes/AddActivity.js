const express = require("express");
const { loginCheck } = require("./middlewares");
const router = express.Router();
const axios = require("axios");

/* GET home page. */

router.get("/AddActivity", loginCheck(), (req, res, next) => {
  console.log(req);
  const user = req.user;
  axios
    .get("https://swapi.py4e.com/api/species")
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
  res.render("user/activities", { user });
});
module.exports = router;
