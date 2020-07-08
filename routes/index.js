const express = require('express');
const { loginCheck } = require('./middlewares');
const router  = express.Router();
const axios = require('axios');
const User=require('../models/User')
const Activity=require('../models/Activity')
/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});
router.get('/activities', loginCheck(), (req, res, next) => {
  const user = req.user;
   User.findById(user._id).then(foundUser=>{
      Activity.find().populate('owner').then(activities => {
          console.log(user.friends)
          activities=activities.filter(activity=>{
              return user.friends.includes(activity.owner._id)
              
          })
          console.log('this is activites',activities);
          res.render('user/activities',{activities})
      })
          .catch(err => {
          console.log(err);
        })
   
   })

});
module.exports = router;
