const express = require("express");
const { loginCheck } = require("./middlewares");
const router = express.Router();
const axios = require("axios");
const Activity = require("../models/Activity");
const User = require("../models/User");

router.get("/activities", loginCheck(), (req, res, next) => {
  const user = req.user;
  User.findById(user._id).then((foundUser) => {
    Activity.find()
      .populate("owner")
      .then((activities) => {
        activities = activities.filter((activity) => {
          return user.friends.includes(activity.owner._id);
        });
        res.render("user/activities", { activities });
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

module.exports = router;
