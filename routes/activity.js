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
    const owner = req.user._id;
    let photo = null;
    let photoId = null;
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
      .then((activity) => {
        User.findByIdAndUpdate(activity.owner, {
          $push: { activities: activity._id },
        }).then(() => {
          res.redirect("/user/profile");
        });
      })
      .catch((err) => console.log(err));
  }
);

router.get("/activity/:id/edit/", loginCheck(), (req, res, next) => {
  const userId = req.user._id;
  const activityId = req.params.id;
  const types = Activity.schema.path("activityType").enumValues;
  Activity.findById(activityId)
    .then((activity) => {
      res.render("user/editactivity", { activity, types });
    })
    .catch((err) => console.log(err));
});

router.post(
  "/activity/:id/edit",
  uploader.single("photo"),
  loginCheck(),
  (req, res, next) => {
    const activityId = req.params.id;
    const {
      activityType,
      distance,
      duration,
      description,
      calories,
    } = req.body;
    let owner, photo, photoId, date;
    Activity.findById(activityId)
      .then((activity) => {
        owner = activity.owner;
        photo = activity.photo;
        photoId = activity.photoId;
        date = activity.date;
      })
      .then(() => {
        if (req.file) {
          photo = req.file.url;
          photoId = req.file.public_id;
        }
        date = req.body.date || date;
        Activity.findByIdAndUpdate(activityId, {
          activityType,
          distance,
          duration,
          description,
          calories,
          photo,
          photoId,
          date,
        }).then((activity) => {
          res.redirect("/user/profile");
        });
      });
  }
);

router.post("/activity/delete/:id", loginCheck(), (req, res, next) => {
  const userId = req.user._id;
  const activityId = req.params.id;
  Activity.findByIdAndDelete(activityId)
    .then(() =>
      User.findByIdAndUpdate(userId, { $pull: { activities: activityId } })
    )
    .then(() => res.redirect("/user/profile"));
});

module.exports = router;
