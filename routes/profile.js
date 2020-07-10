const express = require("express");
const { uploader, cloudinary } = require("../config/cloudinary");
const { loginCheck } = require("./middlewares");
const router = express.Router();
const axios = require("axios");
const User = require("../models/User");
router.get("/user/:_id", loginCheck(), (req, res) => {
  const userId = req.user;
  User.findById(userId)
    .populate("activities")
    .then((userFromDataBase) => {
      res.render("user/profile", {
        user: userFromDataBase,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
router.post("/profile/add", uploader.single("photo"), (req, res, next) => {
  const { title, description } = req.body;
  const imgPath = req.file.url;
  const imgName = req.file.originalname;
  User.findByIdAndUpdate(req.user._id, {
    avatar: imgPath,
  })
    .then((userFromDB) => {
      res.redirect("/user/:_id");
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/user/:id/add", (req, res) => {
  const id = req.user._id;
  const friendId = req.params.id;
  User.findById(id).then((user) => {
    if (user.friends.includes(friendId)) {
      res.render("user/search", {
        message: "You have already befriended this user",
      });
    } else {
      User.findByIdAndUpdate(id, {
        $push: { friends: friendId },
      }).then((user) => {
        res.redirect("/user/search");
      });
    }
  });
});

router.post("/search", (req, res) => {
  
 
  const search = req.body.text2;
  console.log(search)
  User.find()
    .then((user) => {
      user = user.filter(
        (c) => c.fullname.includes(search) && c.id !== req.user.id
      );
      res.render("user/search", { user });
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
