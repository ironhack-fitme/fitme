const express = require("express");
const { loginCheck } = require("./middlewares");
const router = express.Router();
const axios = require("axios");
const Activity = require("../models/Activity");
const Comment = require("../models/Comment");
const User = require("../models/User");
const { uploader, cloudinary } = require("../config/cloudinary");

/* GET home page. */

router.get("/AddActivity", loginCheck(), (req, res, next) => {
  let types = Activity.schema.path("activityType").enumValues;
  res.render("user/AddActivity", { types });
});

router.post(
  "/AddActivity",
  loginCheck(),
  uploader.single("photo"),
  (req, res, next) => {
    const {
      activityType,
      distance,
      duration,
      description,
      calories,
    } = req.body;
    const owner = req.user;
    let photo = "No photo";
    let photoId = "No photo";
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
  }
);

module.exports = router;
