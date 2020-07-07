const express = require('express');
const { loginCheck } = require('./middlewares');
const router  = express.Router();
const axios = require('axios');
const Activity = require('../models/Activity');
const User = require('../models/User');

router.get('/activities', loginCheck(), (req, res, next) => {
    const user = req.user;
    User.findById(req.user).then(foundUser=>{
        Activity.find().then(activites => {
            console.log(activities);
            activites=activites.filter(activity=>{
                return user.friends.includes(activity.owner)
                
            })
            res.render('user/activities', {Activites})
            .catch(err => {
            console.log(err);
          })
      })
    })
 ;
});

module.exports = router;