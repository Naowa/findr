var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var models = require('../models');



/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

var UserModel = models.Users;


// router.post('/register', function(req, res, next) {
//   var body = req.body;
//   var user = new User({ email: body.email, password: body.password});
//   user.save().then(() => console.log('saved'));
// })

router.post('/register', function(req, res, next){
  var body = req.body;
  var email = body.email;
  var password = body.password;

  var newUser = {
    email,
    password
  };

  UserModel.create(newUser)
    .then(() => {
      res.status(200).end();
     })
    .catch((error) => { console.log(error)
      if (error.code === 11000) {
        res.status(400).send("Email already associated with an account.");
      }
    })
}) 

router.post('/login', function(req, res, next){
  if (req.session.email) res.status(200).end();
  else {
    UserModel.findOne({ email: req.body.email, password: req.body.password}).then((person) => {
    if (!(person)) {
      res.status(400).send("Invalid email or password");
    }
    else {
      req.session.email = person.email;
      res.status(200).end();
    }
    }) 
  }
})

module.exports = router;
