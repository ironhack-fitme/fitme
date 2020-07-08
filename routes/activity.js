const express = require("express");
const { loginCheck } = require("./middlewares");
const router = express.Router();
const axios = require("axios");
const Activity = require("../models/Activity");
const Comment = require("../models/Comment");
const User = require("../models/User");
const { uploader, cloudinary } = require("../config/cloudinary");

router.post("/deleteactivity", loginCheck(), (req, res, next) => {
  const owner = req.user;
  const id = req.body.id;
  Activity.findOneAndDelete(id).then((activity) => {});
  if (req.file) {
    photo = req.file.url;
    photoId = req.file.public_id;
  }
  const date = req.body.date || Date.now();
  Activity.create({
    owner,
    date,
    description,
    activityType,
    calories,
    duration,
    distance,
    photo,
    photoId,
  })
    .then(() => {
      res.redirect("/activities");
    })
    .catch((err) => console.log(err));
});

module.exports = router;
