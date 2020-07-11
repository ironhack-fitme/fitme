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
      .populate({ path: "comments", populate: { path: "owner" } })
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
router.post("/activities/:activityId", function (req, res) {
  let activityId = req.params.activityId;
  let user = req.user._id;
  Activity.findById(activityId)
    .then((foundActivity) => {
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
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/activities/comments/:activityId", function (req, res) {
  let activityId = req.params.activityId;
  const { newComment } = req.body;
  Comment.create({
    text: newComment,
    Activity: activityId,
    owner: req.user._id,
  })
    .then((comments) => {
      res.json({ comments, user: req.user.fullname });
      Activity.findByIdAndUpdate(activityId, {
        $push: { comments: comments._id },
      })
        .then((activity) => res.json(activity))
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => console.log(err));
});

module.exports = router;
