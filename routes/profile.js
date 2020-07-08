const express = require('express');
const uploadCloud=require('../config/cloudinary-profile')
const {
  loginCheck
} = require('./middlewares');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User')
router.get('/user/:_id', loginCheck(), (req, res) => {
  const userId = req.user;
  console.log(userId)
  User.findById(userId).populate('activities').then(userFromDataBase => {
    console.log(userFromDataBase.activites);
    res.render('user/profile', {
      user: userFromDataBase,
    });
    
  }).catch(err => {
    console.log(err);
  });
});

router.post("/profile/add", uploadCloud.single("photo"), (req, res, next) => {
  const { title, description } = req.body;
  const imgPath = req.file.url;
  const imgName = req.file.originalname;
User.findByIdAndUpdate(req.user._id,{avatar:imgPath}).then(userFromDB=>{
res.redirect('/user/:_id')
}) .catch(error => {
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