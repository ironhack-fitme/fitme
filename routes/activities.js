const express = require("express");
const { loginCheck } = require("./middlewares");
const router = express.Router();
const axios = require("axios");
const Activity = require("../models/Activity");
const User = require("../models/User");
const Comment = require("../models/Comment");
router.get("/activities", loginCheck(), (req, res, next) => {
  const user = req.user;
  User.findById(user._id).then((foundUser) => {
    Activity.find()
      .populate("owner")
      .populate("comments")
      .then((activities) => {
        console.log(user.friends);
        activities = activities.filter((activity) => {
          return user.friends.includes(activity.owner._id);
        });
        console.log("this is activites", activities);
        res.render("user/activities", { activities });
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
router.post("/activities/:activityId", function (req, res) {
  let activityId = req.params.activityId;
  let user = req.user._id;
  console.log(activityId);
  Activity.findById(activityId)
    .then((foundActivity) => {
      //console.log(foundActivity)
      //console.log(req.user._id);
      let likes = foundActivity.likes;
      if (foundActivity.likes.includes(user)) {
        Activity.findByIdAndUpdate(
          activityId,
          { $pull: { likes: user } },
          { new: true }
        )
          .then((activity) => res.json(activity))
          .catch((err) => {
            console.log(err);
          });
      } else {
        Activity.findByIdAndUpdate(
          activityId,
          { $push: { likes: user } },
          { new: true }
        )
          .then((activity) => res.json(activity))
          .catch((err) => {
            console.log(err);
          });
      }
      console.log(foundActivity.likes);
    })
    .catch((err) => {
      console.log(err);
    });
});
router.post("/activities/comments/:activityId", function (req, res) {
  let activityId = req.params.activityId;

  console.log("comments called");
  console.log(activityId);
  console.log(req.body);
  const { newComment } = req.body;
  console.log(newComment);
  Comment.create({
    text: newComment,
    Activity: activityId,
    owner: req.user._id,
  })
    .then((comments) => {
      console.log(comments);
      Activity.findByIdAndUpdate(activityId, {
        $push: { comments: comments._id },
      })
        .then((activity) => res.json(activity))
        .catch((err) => {
          console.log(err);
        });
      res.redirect("/activities");
    })
    .catch((err) => console.log(err));
});

module.exports = router;
