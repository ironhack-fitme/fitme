const express = require("express");
const { uploader, cloudinary } = require("../config/cloudinary");
const { loginCheck } = require("./middlewares");
const router = express.Router();
const axios = require("axios");
const User = require("../models/User");
router.get("/user/:_id", loginCheck(), (req, res) => {
  const userId = req.user;
  User.findById(userId)
    .populate("activites")
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
  // Movie.create({ title, description, imgPath, imgName })
  //   .then(movie => {
  //     res.redirect("/");
  //   })
});
//---------------
module.exports = router;
// module.exports=uploader;
